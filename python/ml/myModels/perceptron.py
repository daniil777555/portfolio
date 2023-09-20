import numpy as np

class Perceptron:
    def __init__(self, lr=0.01, n_iters=1000) -> None:
        self.lr = lr
        self.n_iters = n_iters
        self.activation_func = self._unit_step_func
        self.w = None
        self.b = None

    def _unit_step_func(self, x):
        return np.where(x > 0, 1, 0)
    
    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    def fit(self, X, y):
        n_samples, n_features = X.shape

        np.random.seed(1)
        # np.random.randn(n_features)
        self.w = np.sum(X * np.random.randn(n_features) * 0.01, axis=0) 
        self.b = 0

        y_ = np.where(y > 0, 1, 0)

        for _ in range(self.n_iters):
            linear_output = np.dot(X, self.w) + self.b
            y_pred = self.activation_func(linear_output)

            self.w += self.lr * np.dot(X.T, (y_ - y_pred))
            self.b += self.lr * np.sum(y_ - y_pred)
                

    def predict(self, X):
        linear_output = np.dot(X, self.w) + self.b
        preds = self._sigmoid(linear_output)
        return np.where(preds > 0.5, 1, 0)
