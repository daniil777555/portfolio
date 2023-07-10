class Game:
    def __init__(self) -> None:
        self.coamndsEnum = {
            'start': 'start',
            'stop': 'stop',
            'quit': 'quit',
            'help': 'help'
        }

        self.comands = [
            [self.coamndsEnum['start'], 'Starts an engine', self.start],
            [self.coamndsEnum['stop'], 'Stops an engine', self.stop],
            [self.coamndsEnum['quit'], 'Quit game', self.quit],
            [self.coamndsEnum['help'], 'See comand list', self.printHelp],
        ]

        self.user_input = ''
        self.state = ''

        self.askInput()

    def askInput(self):
        self.user_input = input('> ').lower()
        self.checkComand()

    def start(self):
        print('Already started') if self.state == self.coamndsEnum['start'] else print(
            'Started.... ready to vrumvrum')
        self.state = self.coamndsEnum['start']
        self.askInput()

    def stop(self):
        print('Already stoped') if self.state == self.coamndsEnum['stop'] else print(
            'Stop.... bffrrr')
        self.state = self.coamndsEnum['stop']
        self.askInput()

    def quit(self):
        print('Exit game')
        return

    def printHelp(self):
        for comand in self.comands:
            print(f'{comand[0]} - {comand[1]}')

        self.askInput()

    def checkComand(self):
        for comand in self.comands:
            if self.user_input == comand[0]:
                comand[2]()
                return

        print('Ooops there is no comand like this')
        self.askInput()


game = Game()
