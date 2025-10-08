from kivy.lang import Builder
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivy.clock import Clock
from datetime import datetime
from kivymd.uix.list import OneLineListItem
from kivy.graphics import Color, Line, Rectangle
from kivymd.uix.label import MDLabel
from kivymd.uix.button import MDRaisedButton
from kivy.uix.widget import Widget




class MainScreen(MDScreen):
    pass  # This class links with layout.kv
class VerticalSeparator(Widget):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.size_hint_x = None
        self.width = 2   # thickness of line
        with self.canvas:
            Color(0, 0, 0, 1)  # black line
            self.rect = Rectangle(pos=self.pos, size=self.size)
        self.bind(pos=self._update_rect, size=self._update_rect)

    def _update_rect(self, *args):
        self.rect.pos = self.pos
        self.rect.size = self.size

class ZERO_GApp(MDApp):

    def build(self):
        Builder.load_file("Antenna_layout.kv")  # Load the KV file
        return MainScreen()
    
    def on_start(self):
        grid = self.root.ids.load_cells
        for i in range(1, 31):  # change 31 -> 101 for 100 cells
            grid.add_widget(MDLabel(text=f"Load Cell {i}", halign="left"))
            grid.add_widget(
                MDRaisedButton(
                    text="Values",
                    md_bg_color=(1, 1, 1, 1),
                    text_color=(0, 0, 0, 1),
                    line_color=(0, 0, 0, 1),
                    radius=[10, 10, 10, 10],  
                )
            )
            # Vertical separator
        grid.add_widget(VerticalSeparator())

    def toggle_theme(self):
        # Toggle between light and dark mode
        if self.theme_cls.theme_style == "Light":
            self.theme_cls.theme_style = "Dark"
        else:
            self.theme_cls.theme_style = "Light"

    def toggle_nav_drawer(self):
        # Placeholder function for opening a navigation drawer
        print("Navigation drawer toggled")

if __name__ == "__main__":
    ZERO_GApp().run()

