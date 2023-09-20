import numpy as np

class PCA:
    def __init__(self, n_components):
        self.n_components = n_components
        self.components = None
        self.mean = None


    def fit(self, X):
        self.mean = np.mean(X, axis = 0)
        X = X - self.mean

        cov = np.cov(X.T)

        eigenvalues, eigenvectors = np.linalg.eig(cov)

        eigenvectors = eigenvectors.T

        idx = np.argsort(eigenvalues)[::-1]
        eigenvalues = eigenvalues[idx]
        eigenvectors = eigenvectors[idx]

        self.components = eigenvectors[:self.n_components]
    
    def fit_transform(self, X):
        self.fit(X)
        return np.dot(X, self.components.T)
    