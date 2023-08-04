from collections import Counter
from copy import deepcopy
import numpy as np


class KNNModel:
    def __init__(self, k=1):
        self.X = []
        self.y = []
        self.k = k

    def get_near_neighbors(self, x):
        distances = np.array(
            np.power(np.sum(np.square(x - self.X), axis=1), 1 / 2))

        dist_ind = distances.argsort()

        return dist_ind[:self.k]

    def fit(self, X, y):
        self.X = X
        self.y = y

    def predict(self, x_test):
        res = []

        for i in range(len(x_test)):
            res.append([])
            neighbors = self.get_near_neighbors(x_test[i])

            for index in neighbors:
                res[i].append(self.y[index])

            res[i] = Counter(res[i]).most_common(1)[0][0]

        return res
