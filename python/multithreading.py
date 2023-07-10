from threading import Lock, Thread
from time import sleep

db_val = 0

def increase(lock: Lock):
    global db_val

    lock.acquire()
    local_val = db_val
    local_val += 1
    sleep(0.1)
    db_val = local_val
    lock.release()


if __name__ == '__main__':
    lock = Lock()
    print('start val: ', db_val)

    thread1 = Thread(target=increase, args=(lock,))
    thread2 = Thread(target=increase, args=(lock,))

    thread1.start()
    thread2.start()

    thread1.join()
    thread2.join()

    print('end val: ', db_val)

