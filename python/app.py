class Game:
    def __init__(self, secret, max_tries):
        self.secret = secret
        self.max_tries = max_tries
        self.guess = ''

    def start(self):
        for i in range(self.max_tries):
            self.guess = input('Enter answer: ')

            if self.guess == self.secret:
                print('You win!')
                return
            elif self.max_tries > (i + 1):
                print('Wrong!')
            elif self.max_tries == (i + 1):
                print('You loose')
                return


game = Game('secret', 3)
game.start()
