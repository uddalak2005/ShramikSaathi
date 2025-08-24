from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import RobustScaler, LabelEncoder
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
import matplotlib.pyplot as plt
import json
import base64
from io import BytesIO
from PIL import Image
import warnings
import os
from pydantic import BaseModel

warnings.filterwarnings("ignore")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

class WorkerInput(BaseModel):
    worker_id: int

@app.post("/worker_forecast/")
async def worker_forecast(input_data: WorkerInput):
    worker_id = input_data.worker_id

    # Initialize result dictionary
    results = {
        'worker_id': worker_id,
        'metrics': {},
        'worker_profile': {},
        'plot': ''
    }

    # Load dataset
    try:
        df = pd.read_csv('/app/extended_worker_dataset_random_reduced.csv')
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Dataset file not found")

    # Filter for one worker_id
    df = df[df['worker_id'] == worker_id].copy()
    if df.empty:
        raise HTTPException(status_code=404, detail=f"No data found for worker_id {worker_id}")

    # Data preprocessing
    df['timestamp'] = pd.to_datetime(df['timestamp'], dayfirst=True, errors='coerce')
    df['has_job'] = (df['job_type'] != "No Job").astype(int)

    # Wage capping
    wage_cap = df[df['contracted_wage'] > 0]['contracted_wage'].quantile(0.98)
    df['contracted_wage'] = df['contracted_wage'].clip(lower=500, upper=wage_cap)

    # Encode categorical
    le_job = LabelEncoder()
    df['job_type_encoded'] = le_job.fit_transform(df['job_type'])
    le_labour = LabelEncoder()
    df['labour_category_encoded'] = le_labour.fit_transform(df['labour_category'])

    # Lagged and rolling features
    df['prev_wage'] = df['contracted_wage'].shift(1).fillna(0)
    df['prev_wage2'] = df['contracted_wage'].shift(2).fillna(0)
    df['prev_wage3'] = df['contracted_wage'].shift(3).fillna(0)
    df['rolling_mean_3'] = df['contracted_wage'].rolling(3, min_periods=1).mean().shift(1).fillna(0)
    df['rolling_std_3'] = df['contracted_wage'].rolling(3, min_periods=1).std().shift(1).fillna(0)
    df['rolling_mean_7'] = df['contracted_wage'].rolling(7, min_periods=1).mean().shift(1).fillna(0)

    # Train/test split
    split_point = int(len(df) * 0.8)
    train_df, test_df = df.iloc[:split_point].copy(), df.iloc[split_point:].copy()

    # Scaling
    scaler = RobustScaler()
    train_df[['job_type_scaled', 'years_exp_scaled', 'prev_wage_scaled', 'prev_wage2_scaled', 'prev_wage3_scaled',
              'rolling_mean_3_scaled', 'rolling_std_3_scaled', 'rolling_mean_7_scaled', 'labour_category_scaled']] = scaler.fit_transform(
        train_df[['job_type_encoded', 'years_of_experience', 'prev_wage', 'prev_wage2', 'prev_wage3',
                  'rolling_mean_3', 'rolling_std_3', 'rolling_mean_7', 'labour_category_encoded']]
    )
    train_df['job_exp_interaction'] = train_df['job_type_scaled'] * train_df['years_exp_scaled']

    # Date features
    for subset in [train_df, test_df]:
        subset['dayofweek'] = subset['timestamp'].dt.dayofweek
        subset['month'] = subset['timestamp'].dt.month
        subset['year'] = subset['timestamp'].dt.year
        subset['dayofyear'] = subset['timestamp'].dt.dayofyear
        subset['is_weekend'] = subset['dayofweek'].isin([5, 6]).astype(int)

    # Classification model
    X_train_class = train_df[['dayofweek', 'month', 'year', 'dayofyear',
                              'is_weekend', 'job_type_encoded', 'feedback_score',
                              'years_of_experience']]
    y_train_class = train_df['has_job']
    classifier = RandomForestClassifier(n_estimators=500, max_depth=12, min_samples_split=5, random_state=42)
    classifier.fit(X_train_class, y_train_class)

    # Regression model (only when has_job=1)
    train_df_reg = train_df[train_df['has_job'] == 1].copy()
    X_train_reg = train_df_reg[['dayofweek', 'month', 'year', 'dayofyear',
                                'is_weekend', 'job_type_scaled', 'feedback_score',
                                'years_exp_scaled', 'job_exp_interaction', 'prev_wage_scaled',
                                'prev_wage2_scaled', 'prev_wage3_scaled', 'rolling_mean_3_scaled',
                                'rolling_std_3_scaled', 'rolling_mean_7_scaled', 'labour_category_scaled']]
    y_train_reg = train_df_reg['contracted_wage']

    # Hyperparameter tuning
    tscv = TimeSeriesSplit(n_splits=5)
    param_grid = {
        'n_estimators': [200, 300, 400],
        'learning_rate': [0.01, 0.05],
        'max_depth': [3, 4, 5],
        'min_samples_split': [3, 4],
        'min_samples_leaf': [2, 3]
    }
    grid_search = GridSearchCV(GradientBoostingRegressor(random_state=42),
                               param_grid, cv=tscv, scoring='neg_mean_absolute_error', n_jobs=-1)
    grid_search.fit(X_train_reg, y_train_reg)
    best_reg = grid_search.best_estimator_
    best_params = grid_search.best_params_

    # Quantile regressors
    reg_lower = GradientBoostingRegressor(loss='quantile', alpha=0.025, **best_params, random_state=42)
    reg_upper = GradientBoostingRegressor(loss='quantile', alpha=0.975, **best_params, random_state=42)
    reg_lower.fit(X_train_reg, y_train_reg)
    reg_upper.fit(X_train_reg, y_train_reg)

    # Future dataframe
    future_df = test_df[['timestamp', 'job_type', 'job_type_encoded', 'feedback_score', 'years_of_experience',
                         'prev_wage', 'prev_wage2', 'prev_wage3', 'rolling_mean_3', 'rolling_std_3', 'rolling_mean_7',
                         'labour_category_encoded']].rename(columns={'timestamp': 'ds'})
    future_df['dayofweek'] = future_df['ds'].dt.dayofweek
    future_df['month'] = future_df['ds'].dt.month
    future_df['year'] = future_df['ds'].dt.year
    future_df['dayofyear'] = future_df['ds'].dt.dayofyear
    future_df['is_weekend'] = future_df['dayofweek'].isin([5, 6]).astype(int)
    future_df[['job_type_scaled', 'years_exp_scaled', 'prev_wage_scaled', 'prev_wage2_scaled', 'prev_wage3_scaled',
               'rolling_mean_3_scaled', 'rolling_std_3_scaled', 'rolling_mean_7_scaled', 'labour_category_scaled']] = scaler.transform(
        future_df[['job_type_encoded', 'years_of_experience', 'prev_wage', 'prev_wage2', 'prev_wage3',
                   'rolling_mean_3', 'rolling_std_3', 'rolling_mean_7', 'labour_category_encoded']]
    )
    future_df['job_exp_interaction'] = future_df['job_type_scaled'] * future_df['years_exp_scaled']

    # Predictions
    future_df['has_job_predicted'] = classifier.predict(
        future_df[['dayofweek', 'month', 'year', 'dayofyear', 'is_weekend', 'job_type_encoded',
                   'feedback_score', 'years_of_experience']]
    )
    future_df['yhat'] = best_reg.predict(
        future_df[['dayofweek', 'month', 'year', 'dayofyear', 'is_weekend', 'job_type_scaled', 'feedback_score',
                   'years_exp_scaled', 'job_exp_interaction', 'prev_wage_scaled', 'prev_wage2_scaled', 'prev_wage3_scaled',
                   'rolling_mean_3_scaled', 'rolling_std_3_scaled', 'rolling_mean_7_scaled', 'labour_category_scaled']]
    )
    future_df['yhat_lower'] = reg_lower.predict(
        future_df[['dayofweek', 'month', 'year', 'dayofyear', 'is_weekend', 'job_type_scaled', 'feedback_score',
                   'years_exp_scaled', 'job_exp_interaction', 'prev_wage_scaled', 'prev_wage2_scaled', 'prev_wage3_scaled',
                   'rolling_mean_3_scaled', 'rolling_std_3_scaled', 'rolling_mean_7_scaled', 'labour_category_scaled']]
    )
    future_df['yhat_upper'] = reg_upper.predict(
        future_df[['dayofweek', 'month', 'year', 'dayofyear', 'is_weekend', 'job_type_scaled', 'feedback_score',
                   'years_exp_scaled', 'job_exp_interaction', 'prev_wage_scaled', 'prev_wage2_scaled', 'prev_wage3_scaled',
                   'rolling_mean_3_scaled', 'rolling_std_3_scaled', 'rolling_mean_7_scaled', 'labour_category_scaled']]
    )

    # Apply job mask
    final_forecast_df = future_df.copy()
    final_forecast_df['yhat'] = np.where(final_forecast_df['has_job_predicted'] == 0, 0, final_forecast_df['yhat'])
    final_forecast_df['yhat'] = np.minimum(final_forecast_df['yhat'], wage_cap)
    final_forecast_df['yhat_lower'] = np.where(final_forecast_df['has_job_predicted'] == 0, 0, future_df['yhat_lower'])
    final_forecast_df['yhat_upper'] = np.where(final_forecast_df['has_job_predicted'] == 0, 0, future_df['yhat_upper'])
    final_forecast_df['yhat_lower'] = np.maximum(final_forecast_df['yhat_lower'], 0)

    # Evaluation
    comparison_df = pd.merge(
        test_df[['timestamp', 'contracted_wage']].rename(columns={'timestamp': 'ds', 'contracted_wage': 'y'}),
        final_forecast_df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']], on='ds', how='left'
    )
    comparison_df = comparison_df.set_index(final_forecast_df.index)  # Align indices
    valid_comparison_df = comparison_df[comparison_df['y'] > 0].copy()

    if not valid_comparison_df.empty:
        valid_y = valid_comparison_df['y'].values
        valid_yhat = valid_comparison_df['yhat'].values
        weights = valid_comparison_df['y'].values / valid_comparison_df['y'].mean()
        
        mae = np.average(np.abs(valid_y - valid_yhat), weights=weights, axis=0)
        mape = np.average(np.abs((valid_y - valid_yhat) / valid_y) * 100, weights=weights, axis=0)
    else:
        mae, mape = np.nan, np.nan

    results['metrics']['mae'] = round(mae, 2) if not np.isnan(mae) else None
    results['metrics']['mape'] = round(mape, 2) if not np.isnan(mape) else None

    # Plot results
    plt.figure(figsize=(12, 6))
    plt.plot(final_forecast_df['ds'], final_forecast_df['yhat'], '-', label='Forecasted', color='blue')
    plt.fill_between(final_forecast_df['ds'], final_forecast_df['yhat_lower'], final_forecast_df['yhat_upper'],
                     color='gray', alpha=0.2, label='Uncertainty')
    plt.title('Forecasted Daily Earnings (Last 20%)')
    plt.xlabel('Date'); plt.ylabel('Contracted Wage')
    plt.legend(); plt.grid(True); plt.xticks(rotation=45); plt.tight_layout()

    # Save plot as PNG → JPG for compression
    buf_png = BytesIO()
    plt.savefig(buf_png, format="png", dpi=80, bbox_inches="tight")
    plt.close()
    buf_png.seek(0)
    img = Image.open(buf_png).convert("RGB")
    buf_jpg = BytesIO()
    img.save(buf_jpg, format="JPEG", quality=70, optimize=True)
    buf_jpg.seek(0)
    plot_base64 = base64.b64encode(buf_jpg.getvalue()).decode("utf-8")
    results['plot'] = f"data:image/jpeg;base64,{plot_base64}"

    # Save plot to file in /tmp
    plot_filename = f"/tmp/worker_{worker_id}_forecast.jpg"
    try:
        with open(plot_filename, "wb") as f:
            f.write(base64.b64decode(plot_base64))
    except PermissionError as e:
        raise HTTPException(status_code=500, detail=f"Failed to write plot file: {str(e)}")

    # Worker profile
    worker_data = df.copy()
    avg_daily = worker_data[worker_data['contracted_wage'] > 0]['contracted_wage'].mean()
    avg_monthly = avg_daily * 30 if not np.isnan(avg_daily) else 0
    job_dist = worker_data['job_type'].value_counts(normalize=True) * 100
    avg_feedback = worker_data['feedback_score'].mean()
    work_index = job_dist.drop(labels=['No Job'], errors='ignore').sum() / 100
    earn_stability = worker_data[worker_data['contracted_wage'] > 0]['contracted_wage'].std() / avg_daily if avg_daily > 0 else np.nan

    results['worker_profile'] = {
        'average_daily_earning': round(avg_daily, 2) if not np.isnan(avg_daily) else None,
        'estimated_monthly_earning': round(avg_monthly, 2) if not np.isnan(avg_monthly) else None,
        'job_distribution': job_dist.round(2).to_dict(),
        'average_feedback_score': round(avg_feedback, 2) if not np.isnan(avg_feedback) else None,
        'work_index': round(work_index, 2) if not np.isnan(work_index) else None,
        'earning_stability': round(earn_stability, 2) if not np.isnan(earn_stability) else None
    }

    def convert_to_serializable(obj):
        if isinstance(obj, (np.floating, np.float32, np.float64)): return float(obj)
        if isinstance(obj, (np.integer, np.int32, np.int64)): return int(obj)
        if isinstance(obj, np.ndarray): return obj.tolist()
        return obj

    # Return JSON response with results
    return JSONResponse(content=json.loads(json.dumps(results, default=convert_to_serializable)))

@app.get("/worker_forecast/plot/{worker_id}")
async def get_forecast_plot(worker_id: int):
    plot_filename = f"/tmp/worker_{worker_id}_forecast.jpg"
    if os.path.exists(plot_filename):
        return FileResponse(plot_filename, media_type="image/jpeg", filename=f"worker_{worker_id}_forecast.jpg")
    else:
        raise HTTPException(status_code=404, detail=f"Plot for worker_id {worker_id} not found")