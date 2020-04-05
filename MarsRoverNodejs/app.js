'use strict';

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Action {
    static move = "M";
    static leftTurn = "L";
    static rightTurn = "R";
}
class Direction {
    static N = "N";
    static S = "S";
    static W = "W";
    static E = "E";
}
class RoverState {
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }
}
class RoverInstructions {
    constructor(initialState, actions) {
        this.initialState = initialState;
        this.actions = actions;
    }
}
class Instructions {
    constructor(plateauMaxPosition, rovers) {
        this.plateauMaxPosition = plateauMaxPosition;
        this.rovers = rovers;
    }
}
///////////// Calculators
class DirectionCalculator {
    turn(currentDirection, action) {
        if (action === Action.move) {
            return currentDirection;
        }
        if (action === Action.leftTurn) {
            switch (currentDirection) {
                case Direction.W:
                    return Direction.S;
                case Direction.S:
                    return Direction.E;
                case Direction.E:
                    return Direction.N;
                case Direction.N:
                    return Direction.W;
                default:
                    throw new Error("Direction not supported:" + currentDirection);
            }
        }
        if (action === Action.rightTurn) {
            switch (currentDirection) {
                case Direction.W:
                    return Direction.N;
                case Direction.S:
                    return Direction.W;
                case Direction.E:
                    return Direction.S;
                case Direction.N:
                    return Direction.E;
                default:
                    throw new Error("Direction not supported:" + currentDirection);
            }
        }
        throw new Error("Action not supported:" + action);
    }
}
class PositionCalculator {
    move(currentState, maxPosition) {
        let newPosition = new Position(currentState.position.x, currentState.position.y);
        
        switch (currentState.direction) {
            case Direction.E:
                newPosition.x = Math.min(maxPosition.x, currentState.position.x + 1);
                break;

            case Direction.W:
                newPosition.x = Math.max(0, currentState.position.x - 1);
                break;

            case Direction.N:
                newPosition.y = Math.min(maxPosition.y, currentState.position.y + 1);
                break;

            case Direction.S:
                newPosition.y = Math.max(0, currentState.position.y - 1);
                break;
        }

        return newPosition;
    }
}
class RoverStateCalculator {
    constructor(directionCalculator, positionCalculator) {
        this.directionCalculator = directionCalculator;
        this.positionCalculator = positionCalculator;
    }

    action(currentState, maxPosition, action) {
        let newState = new RoverState(currentState.position, this.directionCalculator.turn(currentState.direction, action));

        if (action === Action.move) {
            newState.position = this.positionCalculator.move(currentState, maxPosition);
        }

        return newState;
    }
}
//////////// Parsers

class InstructionParser {

    constructor(positionParser,
        roverInitialStateParser,
        roverActionParser) {
        this.positionParser = positionParser;
        this.roverInitialStateParser = roverInitialStateParser;
        this.roverActionParser = roverActionParser;
    }
    parse(instructionString) {
        let lines = instructionString.split("\n");
        let position = this.positionParser.parsePlateauMaxPosition(lines[0]);

        let roverCount = (lines.length - 1) / 2;
        let rovers = [];
        for (let roverIndex = 0; roverIndex < roverCount; roverIndex++) {
            rovers.push(new RoverInstructions(this.roverInitialStateParser.parse(lines[roverIndex * 2 + 1]),
                this.roverActionParser.parse(lines[roverIndex * 2 + 2])));
        }

        return new Instructions(position, rovers);
    }
}

class PositionParser
{
    parsePlateauMaxPosition(line)
    {
        let plateauMaxPosition = line.split(" ");
        return new Position(parseInt(plateauMaxPosition[0]), parseInt(plateauMaxPosition[1]));
    }
}
class RoverActionParser
{
    parse(actions) {
        let actionArray = [];
        for (let i = 0; i < actions.length; i++) {
            actionArray.push(this.parseActionChar(actions[i]));
        } 
        return actionArray;
    }

    parseActionChar(action)
    {
        switch (action) {
        case 'M': return Action.move;
        case 'L': return Action.leftTurn;
        case 'R': return Action.rightTurn;
        default: throw new Error("Action not supported: " + action);
        }
    }
}
class RoverInitialStateParser
{
    parse(initialState)
    {
        let states = initialState.split(" ");
        return new RoverState(new Position(parseInt(states[0]),
                    parseInt(states[1])), states[2]);
    }
}
////////////////
class RoverController
{
    constructor(instructionParser,
         roverStateCalculator)
    {
        this.instructionParser = instructionParser;
        this.roverStateCalculator = roverStateCalculator;
    }
    run(instructionString)
    {
        let instructions = this.instructionParser.parse(instructionString);
        let finalStates = [];
        for (let i = 0; i < instructions.rovers.length; i++) {
            
            let rover = instructions.rovers[i];
            let state = rover.initialState;
            for (let j = 0; j < rover.actions.length; j++) {
                let action = rover.actions[j];
                state = this.roverStateCalculator.action(state, instructions.plateauMaxPosition, action);
            }
            finalStates.push(state);
        }

        return finalStates.map(function (s) {
            return s.position.x + " " + s.position.y + " " + s.direction;
        }).join("\r\n");
    }
}


module.exports = {
    Action: Action,
    Direction: Direction,
    DirectionCalculator: DirectionCalculator,
    InstructionParser: InstructionParser,
    Instructions: Instructions,
    Position: Position,
    PositionCalculator: PositionCalculator,
    PositionParser: PositionParser,
    RoverActionParser: RoverActionParser,
    RoverController: RoverController,
    RoverInitialStateParser: RoverInitialStateParser,
    RoverInstructions: RoverInstructions,
    RoverState: RoverState,
    RoverStateCalculator: RoverStateCalculator
};