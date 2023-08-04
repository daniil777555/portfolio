import numpy as np
from sklearn.preprocessing import StandardScaler

class LogisticRegrassion:
    def __init__(self, lr=0.001, n_iters=3500):
        self.lr = lr
        self.n_iters = n_iters
        self.w = None
        self.b = None

    def _get_scaled_data(self, data):
        scaler = StandardScaler()
        return scaler.fit_transform(data)

    def fit(self, X, y):
        n_samples, n_features = X.shape
        X = self._get_scaled_data(X)

        np.random.seed(1)
        self.w = 0.01 * np.random.randn(n_features)
        self.b = 0

        for _ in range(self.n_iters):
            linear_pred = np.dot(X, self.w) + self.b
            preds = self._sigmoid(linear_pred)

            dw = (1 / n_samples) * np.dot(2 * X.T, (preds - y))
            db = (1 / n_samples) * np.sum(2 * (preds - y))

            self.w = self.w - self.lr * dw
            self.b = self.b - self.lr * db

    def predict(self, X_test):
        X_test = self._get_scaled_data(X_test)
        linear_pred = np.dot(X_test, self.w) + self.b
        preds = self._sigmoid(linear_pred)
        return np.where(preds > 0.5, 1, 0)
    
    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))