from multiprocessing import Lock, Process, Value
import os
import time


processes = []
num_p = os.cpu_count()


def add100(v, lock):
  time.sleep(0.1)
  with lock:
    v.value += 100

if __name__ == '__main__':
  global_val = Value('i', 0)
  lock = Lock()
  print('start value: ', global_val.value)

  prcs1 = Process(target=add100, args=(global_val, lock))
  prcs2 = Process(target=add100, args=(global_val, lock))

  prcs1.start()
  prcs2.start()

  prcs1.join()
  prcs1.join()

  print('at end number is: ', global_val.value)



print('The end')
