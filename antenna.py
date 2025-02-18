from kivy.lang import Builder
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivy.clock import Clock
from datetime import datetime
from kivymd.uix.list import OneLineListItem


class MainScreen(MDScreen):
    pass  # This class links with layout.kv

class MyApp(MDApp):

    def build(self):
        Builder.load_file("Antenna_layout.kv")  # Load the KV file
        return MainScreen()
    
    def send_message(self, message_text):
        """Function to add messages to the message window"""
        if message_text.strip():  # Check if the message is not empty
            message_item = OneLineListItem(text=message_text)
            self.root.ids.message_window_list.add_widget(message_item)

        self.root.ids.message_input.text = ""  # Clear input field
    
    def toggle_theme(self):
        # Toggle between light and dark mode
        if self.theme_cls.theme_style == "Light":
            self.theme_cls.theme_style = "Dark"
        else:
            self.theme_cls.theme_style = "Light"

    def toggle_nav_drawer(self):
        # Placeholder function for opening a navigation drawer
        print("Navigation drawer toggled")

    def update_progress(self, dt):
        progress = self.root.ids.progress_bar
        label = self.root.ids.progress_label
        
        if progress.value < 100:
            progress.value += 2  # Increase progress smoothly
        else:
            progress.value = 0  # Reset when full
        
        label.text = f"{int(progress.value)}%"  # Update label text dynamically

    def on_start(self):
        Clock.schedule_interval(self.update_progress, 1)  # Update every second



if __name__ == "__main__":
    MyApp().run()

