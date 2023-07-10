# Peh - probability of truth of hypothesis in case when result is positive,
# Ph - a priori probability,
# Pefh - inverse Peh (1 - Peh),
# Pfh - inverse Ph (1 - Ph).

try:
    Peh = float(input('Enter probability of truth of hypothesis: '))
    Ph = float(input('Enter priori probability: '))
    pow_input = input(
        'Enter a power in case you want to know probability in many times: ')
    pow = int(pow_input) if pow_input.isnumeric() else 1

    # ((Peh * Ph) / (Peh * Ph + Pefh * Pfh))
    print(((Peh * Ph) / (Peh * Ph + (1 - Peh) * (1 - Ph))) ** pow)
except ValueError:
    print('Incorrect value')
