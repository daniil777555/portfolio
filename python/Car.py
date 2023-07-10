class Car:
    def __init__(self, model, beepbeep_sound) -> None:
        self.model = model
        self.beepbeep_sound = beepbeep_sound

    def show_model(self):
        print('Car\'s model is ' + self.model)

    def do_beep(self):
        print(self.beepbeep_sound)

    def print_wheels(self):
        print('The car has 4 wheels')
