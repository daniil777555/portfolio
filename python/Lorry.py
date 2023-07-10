from Car import Car


class Lorry(Car):
    def __init__(self, model, beepbeep_sound, vrumvrum_sound) -> None:
        super().__init__(model, beepbeep_sound)
        self.vrumvrum_sound = vrumvrum_sound

    def do_vrumvrum(self):
        print(self.vrumvrum_sound)

    def print_wheels(self):
        return print('The car has 12 wheels')


lorry = Lorry('Mercedes', 'beeeeeeeeeeeebeeeeeeeeeeeee',
              'vrrrrrrrrrrrrrrrrrrrrrrrrrrrdredddddrrdrdrdrrdrrdr')

lorry.do_beep()
lorry.do_vrumvrum()
lorry.print_wheels()
lorry.show_model()

car = Car('BMW', 'bep')

car.show_model()
car.do_beep()
car.print_wheels()
