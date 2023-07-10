from threading import Thread


threads = []
num_thr = 10


def power_num():
    for i in range(1000):
        i * i


for i in range(num_thr):
    # , args=(i * 1000,)
    t = Thread(target=power_num)
    threads.append(t)

if __name__ == '__main__':

    for t in threads:
        t.start()

    for t in threads:
        t.join()


print('The end')
