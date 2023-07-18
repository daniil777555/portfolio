from copy import deepcopy
import numpy as np

class KNNModel:
    def __init__(self, k=1):
        self.X = []
        self.y = []
        self.k = k

    def get_near_neighbors(self, x):
        res = []
        distances = np.array(
            np.power(np.sum(np.square(self.X - x), axis=1), 1 / 2))

        distances_copy = deepcopy(distances)

        for i in range(self.k):
            min_val = np.amin(distances_copy)
            res.append(
                (min_val, np.where(distances == min_val)[0][0]))
            distances_copy = np.delete(distances_copy, [res[i][1]])

        return res

    def fit(self, X, y):
        self.X = X
        self.y = y

    def predict(self, x_test):
        res = []
        
        for i in range(len(x_test)):
            res.append([])
            neighbors = self.get_near_neighbors(x_test[i])

            for (_, index) in neighbors:
                res[i].append(self.y[index])

            res[i] = (len(res[i]) / 2 <= np.sum(res[i])).astype(int)        

        return res
