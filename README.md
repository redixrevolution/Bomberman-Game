## Name
BombermanJS

## Description
BombermanJS is a JavaScript-based implementation of the classic Bomberman game. It allows two players to compete against each other on a 2-dimensional field, strategically placing bombs to destroy obstacles and opponents while avoiding monsters. This README provides an overview of the project, installation instructions, usage examples, support resources, and more.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

//Pending

## Visuals
All image content was taken from: https://www.spriters-resource.com/turbografx_16/bomberman

## Installation
To install BombermanJS, follow these steps:

1. Clone the repository from GitHub: git clone https://szofttech.inf.elte.hu/software-technology-2024/group-5/osama
2. Navigate to the project directory: cd bombermanjs
3. Install dependencies: npm install
4. Start the game: npm start


## Usage
To play BombermanJS, open the game in a web browser after following the installation instructions. Use the arrow keys to move your character and press the spacebar to place bombs strategically. The goal is to be the last player standing by eliminating opponents and avoiding monsters.

## Support
For help or assistance with BombermanJS, please submit an issue on the GitHub repository or contact one of the project team members:

Onyango Maurice (D4CEMH)
Osama Al-Madanat (FH9S0R)
Kasapolli Bardh (FA0PJE)


## Shortcomings
Absence of Monsters:
Description: The game currently lacks AI-controlled monsters, resulting in gameplay that is limited to player-versus-player interactions.
Impact: This absence reduces the diversity of gameplay experiences, as players do not have the challenge of avoiding or strategizing against non-player enemies. This could potentially make the game less engaging for some players who enjoy varied challenges.
Lack of Networking Capabilities:
Description: The game does not support networked play, meaning that two players cannot play against each other remotely over the internet or a local network.
Impact: This limits the game's multiplayer experience to local play only, reducing its accessibility and appeal to players who want to play with friends or other players who are not in the same physical location.
Lack of Multithreading:
Description: The game is currently implemented in JavaScript without utilizing multithreading capabilities.
Impact: This can lead to performance bottlenecks, especially as the game's complexity increases, as JavaScript traditionally runs on a single thread. 

## Roadmap
Future releases of BombermanJS may include:

Improved AI for monsters
Additional power-ups and game modes
Enhanced graphics and animations
Enhance Multiplayer Features: Implementation: Introduce new multiplayer modes, such as cooperative modes where players team up against AI monsters or competitive modes with different objectives and rules.
Benefits:Varied Gameplay: Provides multiple ways to play, keeping the experience fresh and engaging.
Increased Player Engagement: Encourages players to spend more time in the game by offering diverse multiplayer experiences.
Utilize Multithreading:Implementation: Introduce multithreading to the game using technologies that enable concurrent execution in JavaScript, such as Web Workers. This allows for parallel processing of intensive tasks.
Implement Networking Capabilities:Implementation: Introduce networking features that allow players to connect and play the game remotely. 

## Contributing
We welcome contributions to BombermanJS! Please fork the repository, make your changes, and submit a pull request. Be sure to follow the project's coding standards and guidelines. For more information, see the CONTRIBUTING.md file in the repository.

## Authors and acknowledgment
BombermanJS is developed by the following team members:

Osama Al-Madanat (FH9S0R)
Kasapolli Bardh (FA0PJE)
Onyango Maurice (D4CEMH)
We appreciate the contributions and support of the open-source community.

## License
BombermanJS is licensed under the MIT License. See the LICENSE file for more details.

## Project status
Development on BombermanJS is ongoing, with regular updates and improvements. However, please note that development may slow down or stop temporarily due to other commitments or priorities. If you're interested in contributing or becoming a maintainer, please reach out to the project team
