import numpy as np
import pandas as pd
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import KFold
import matplotlib.pyplot as plt
import time
from sklearn.metrics import mean_absolute_error

data = pd.read_csv("train_data.csv")

X = data.drop('PRICE_PER_SQRMETER', axis='columns', inplace=False)
X = pd.get_dummies(X, dummy_na=True)

ss = StandardScaler()
X = ss.fit_transform(X)

y = data.loc[:, ['PRICE_PER_SQRMETER']].values


def Kfold(X, y, l, K, c, start):
    kf = KFold(n_splits=K)
    train_error = 0
    cv_error = 0
    for train_index, test_index in kf.split(X):

        X_train, X_test = X[train_index], X[test_index]
        y_train, y_test = y[train_index], y[test_index]

        clf = Lasso(alpha=l)
        clf.fit(X_train, y_train)

        train_error += mean_absolute_error(y_train, clf.predict(X_train))
        cv_error += mean_absolute_error(y_test, clf.predict(X_test))

        c += 1
        now = time.time()
        progress = c/(17 * K)
        used = (now - start)
        print("Progress: ", (progress * 100), "%")
        print("Used: ", int(used / 60), " min")
        print("Expected: ", int((used/progress - used)/60), " min")
    return train_error/K, cv_error/K


f_lambda = []
lambda_coef = np.arange(-2, 2.25, 0.25)
lambda_list = [10 ** l for l in lambda_coef]
min_ev_error = float("inf")
best_lambda = 0


start = time.time()
c = 0
k = 5
for i in range(0, len(lambda_list)):
    (train_error, cv_error) = Kfold(
        X, y, lambda_list[i], k, c, start)
    f_lambda.append((train_error, cv_error))
    if cv_error < min_ev_error:
        min_ev_error = cv_error
        best_lambda = i
    c += k


print("Best value of lambda: 10 **", lambda_coef[best_lambda])
# plot the result
f_lambda = np.array(f_lambda)
plt.plot(lambda_coef, f_lambda[:, [0]])
plt.plot(lambda_coef, f_lambda[:, [1]])
plt.title("Error - lambda in Lasso regression")
plt.ylabel("Error")
plt.xlabel("lambda")
plt.xticks(lambda_coef)
plt.legend(["training error", "cross-validation error"])
plt.show()
