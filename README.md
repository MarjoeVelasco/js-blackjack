# Javascript Blackjack Game

This is a simple implementation of the classic blackjack card game using only HTML, CSS, and JavaScript. No external libraries or frameworks are used in this project, making it a lightweight and easy-to-understand example.

![marjoevelasco github io_js-blackjack_](https://github.com/MarjoeVelasco/js-blackjack/assets/46857235/508a71f1-90bf-4213-989a-5a4148f23375)

## How to Play

1. **Objective**: The goal of blackjack is to beat the dealer by having a hand value closer to 21 than the dealer's hand, without exceeding 21.

2. **Card Values**: Number cards are worth their face value, face cards (*Jack, Queen, King*) are worth 10, and the *Ace* can be worth either 1 or 11, depending on which value benefits the player's hand.

3. **Game Flow**:
   - Click the **"Deal"** button to start a new hand.
   - Two cards are dealt to both the player and the dealer. One of the dealer's cards is face up.
   - You can choose to **"Hit"** (receive another card) or **"Stand"** (keep your current hand) by clicking the corresponding buttons.
   - If the total value of your hand exceeds 21, you bust and lose the round.
   - After the player's turn, the dealer reveals their face-down card and draws additional cards according to a set of rules.
   - The dealer must hit until their hand's value is 17 or higher.
   - The winner is determined based on who has the highest hand value without exceeding 21.

4. **Scoring**:
   - If you win, your bet is doubled and added to your balance.
   - If you lose, you lose your bet amount.
   - If the game results in a tie (both player and dealer have the same hand value), your bet is returned.

## Setup

1. Clone this repository to your local machine or download the ZIP file.

2. Open the `index.html` file in your web browser.

## Customization

You can easily customize the game's appearance and behavior by modifying the `styles.css` for styling and `script.js` for the game logic.

## Acknowledgments

This project was created as a learning exercise and is meant to showcase a simple implementation of a blackjack game using pure JavaScript. Feel free to use and modify the code for your own projects.

## License

This project is licensed under the **MIT License**.

---

Have fun playing the **Pure JavaScript Blackjack Game**! If you have any questions or suggestions, feel free to contact us at [email@example.com](mailto:email@example.com).
