import numpy as np
from sklearn.preprocessing import StandardScaler

class LinearRegression:
    def __init__(self):
        self.lr = 0.01
        self.n_iters = 10000
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
            y_pred = np.dot(X, self.w) + self.b

            dw = (1 / n_samples) * np.dot(X.T, (y_pred - y))
            db = (1 / n_samples) * np.sum(y_pred - y)

            self.w = self.w - self.lr * dw
            self.b = self.b - self.lr * db

    def predict(self, X):
      X = self._get_scaled_data(X)
      return np.dot(X, self.w) + self.b
    
    def score(self, X, y):
        X = self._get_scaled_data(X)
        y_pred = np.dot(X, self.w) + self.b
        rss = np.sum((y - y_pred) ** 2)
        tss = np.sum((y - np.mean(y)) ** 2)
        return 1 - (rss / tss)