import numpy as np

class SVM:
    def __init__(self, lr = 0.005, lambda_param = 0.008, n_iters = 3500):
        self.lr = lr
        self.lambda_param = lambda_param
        self.n_iters = n_iters
        self.w = None
        self.b = None

    def fit(self, X, y):
        n_samples, n_features = X.shape

        y_ = np.where(y <= 0, -1, 1)

        np.random.seed(1)
        # self.lambda_param * np.random.randn(n_features)
        self.w = np.sum(X * np.random.randn(n_features) * 0.01, axis=0)
        self.b = 0

        for _ in range(self.n_iters):
            conditions = y_ * (np.dot(X, self.w) - self.b)

            if np.sum(conditions) >= 1:
                self.w -= self.lr * (2 * self.lambda_param * self.w)
            else:
                self.w -= self.lr * (2 * self.lambda_param * self.w - np.dot(X.T, y_))
                self.b -= np.sum(y_ * self.lr)

    
    def predict(self, X_test):
        approx = np.dot(X_test, self.w) - self.b
        return np.where(approx <= 0, 0, 1)