let app = require("./app.js");

let Action = app.Action;
let Direction = app.Direction;
let DirectionCalculator = app.DirectionCalculator;
let InstructionParser = app.InstructionParser;
let Instructions = app.Instructions;
let Position = app.Position;
let PositionCalculator = app.PositionCalculator;
let PositionParser = app.PositionParser;
let RoverActionParser = app.RoverActionParser;
let RoverController = app.RoverController;
let RoverInitialStateParser = app.RoverInitialStateParser;
let RoverInstructions = app.RoverInstructions;
let RoverState = app.RoverState;
let RoverStateCalculator = app.RoverStateCalculator;


describe('RoverController', function () {
    it('Integration test', function () {
        let roverController = new RoverController(
            new InstructionParser(new PositionParser(), new RoverInitialStateParser(), new RoverActionParser()),
            new RoverStateCalculator(new DirectionCalculator(), new PositionCalculator()));

        let instructionString = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;

        // Act
        var result = roverController.run(instructionString);

        console.log(result);
        console.log('end');
        expect(result).toBe('1 3 N\r\n5 1 E');
    });
});


describe('RoverController', function () {
    it('run() returns correct result', function () {
        let instructionParser = {
            parse: function() {
                return {
                    rovers: [
                        {
                            actions: [
                                {},
                                {},
                                {}
                            ]
                        },
                        {
                            actions: [
                                {},
                                {}
                            ]
                        }
                    ],
                    plateauMaxPosition: {
                        x: 4,
                        y: 6
                    }
                }
            }
        };
        let roverStateCalculator = {
            action: function() {
                return {
                    direction: Direction.E,
                    position: {
                        x: 32,
                        y: 54
                    }
                }
            }
        };
        let roverController = new RoverController(instructionParser, roverStateCalculator);

        let instructionString = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;

        // Act
        var result = roverController.run(instructionString);

        expect(result).toBe('32 54 E\r\n32 54 E');
    });
});


describe('DirectionCalculator', function () {
    [
        {
            currentDirection: Direction.W,
            action: Action.move,
            expectedDirection: Direction.W
        },
        {
            currentDirection: Direction.N,
            action: Action.move,
            expectedDirection: Direction.N
        },
        {
            currentDirection: Direction.S,
            action: Action.move,
            expectedDirection: Direction.S
        },
        {
            currentDirection: Direction.E,
            action: Action.move,
            expectedDirection: Direction.E
        },


        {
            currentDirection: Direction.W,
            action: Action.leftTurn,
            expectedDirection: Direction.S
        },
        {
            currentDirection: Direction.N,
            action: Action.leftTurn,
            expectedDirection: Direction.W
        },
        {
            currentDirection: Direction.S,
            action: Action.leftTurn,
            expectedDirection: Direction.E
        },
        {
            currentDirection: Direction.E,
            action: Action.leftTurn,
            expectedDirection: Direction.N
        },


        {
            currentDirection: Direction.W,
            action: Action.rightTurn,
            expectedDirection: Direction.N
        },
        {
            currentDirection: Direction.N,
            action: Action.rightTurn,
            expectedDirection: Direction.E
        },
        {
            currentDirection: Direction.S,
            action: Action.rightTurn,
            expectedDirection: Direction.W
        },
        {
            currentDirection: Direction.E,
            action: Action.rightTurn,
            expectedDirection: Direction.S
        },


    ].forEach(function (test) {
        it(desc("turn()", test),
            function () {
                let calculator = new DirectionCalculator();
                let result = calculator.turn(test.currentDirection, test.action);

                expect(result).toBe(test.expectedDirection);
            });
    });
});


describe('InstructionParser', function () {
    [
        {
            instructions: "5 5",
            plateauMaxX: 5,
            plateauMaxY: 5,
            roverCount: 0
        },
        {
            instructions: "5 7",
            plateauMaxX: 5,
            plateauMaxY: 7,
            roverCount: 0
        },
        {
            instructions: `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`,
            plateauMaxX: 5,
            plateauMaxY: 5,
            roverCount: 2
        },
    ].forEach(function (test) {
        it(desc("parse()", test),
            function () {
                let parser = new InstructionParser(new PositionParser(), new RoverInitialStateParser(), new RoverActionParser())
                let result = parser.parse(test.instructions);

                expect(result.plateauMaxPosition.x).toBe(test.plateauMaxX);
                expect(result.plateauMaxPosition.y).toBe(test.plateauMaxY);
                expect(result.rovers.length).toBe(test.roverCount);
            });
    });

    it("parse() actions ",
        function () {
            let parser = new InstructionParser(new PositionParser(), new RoverInitialStateParser(), new RoverActionParser())
            let result = parser.parse(`5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`);

            expect(result.plateauMaxPosition.x).toBe(5);
            expect(result.plateauMaxPosition.y).toBe(5);
            expect(result.rovers.length).toBe(2);
            expect(result.rovers[0].actions[0]).toBe(Action.leftTurn);
        });
});


describe('PositionCalculator', function () {
    [
        {
            x: 0,
            y: 0,
            direction: Direction.N,
            expectedX: 0,
            expectedY: 1
        },
        {
            x: 0,
            y: 2,
            direction: Direction.N,
            expectedX: 0,
            expectedY: 3
        },
        {
            x: 0,
            y: 9,
            direction: Direction.N,
            expectedX: 0,
            expectedY: 9
        },

        {
            x: 0,
            y: 0,
            direction: Direction.S,
            expectedX: 0,
            expectedY: 0
        },
        {
            x: 0,
            y: 2,
            direction: Direction.S,
            expectedX: 0,
            expectedY: 1
        },
        {
            x: 0,
            y: 9,
            direction: Direction.S,
            expectedX: 0,
            expectedY: 8
        },

        {
            x: 0,
            y: 0,
            direction: Direction.W,
            expectedX: 0,
            expectedY: 0
        },
        {
            x: 2,
            y: 0,
            direction: Direction.W,
            expectedX: 1,
            expectedY: 0
        },
        {
            x: 4,
            y: 0,
            direction: Direction.W,
            expectedX: 3,
            expectedY: 0
        },

        {
            x: 0,
            y: 0,
            direction: Direction.E,
            expectedX: 1,
            expectedY: 0
        },
        {
            x: 2,
            y: 0,
            direction: Direction.E,
            expectedX: 3,
            expectedY: 0
        },
        {
            x: 4,
            y: 0,
            direction: Direction.E,
            expectedX: 4,
            expectedY: 0
        },
    ].forEach(function (test) {
        it(desc("move()", test),
            function () {
                let calculator = new PositionCalculator();
                let currentState = new RoverState(new Position(test.x, test.y), test.direction);
                let maxPosition = new Position(4, 9);
                let result = calculator.move(currentState, maxPosition);

                expect(result.x).toBe(test.expectedX);
                expect(result.y).toBe(test.expectedY);
            });
    });
});


describe('RoverActionParser', function () {
    [
        {
            actions: "",
            expectedActions: ""
        },
        {
            actions: "LMLMLMLMM",
            expectedActions: "L,M,L,M,L,M,L,M,M"
        },
        {
            actions: "MMRMMRMRRM",
            expectedActions: "M,M,R,M,M,R,M,R,R,M"
        }
    ].forEach(function (test) {
        it(desc("parse()", test),
            function () {
                let parser = new RoverActionParser();
                let result = parser.parse(test.actions).join(",");

                expect(result).toBe(test.expectedActions);
            });
    });

    [
        {
            actions: "KLM",
            expectedErrorMessage: "Action not supported: K"
        },
        {
            actions: "MRLS",
            expectedErrorMessage: "Action not supported: S"
        }
    ].forEach(function (test) {
        it(desc("parse()", test),
            function () {
                let parser = new RoverActionParser();

                expect(function () {
                    parser.parse(test.actions);
                }).toThrow(new Error(test.expectedErrorMessage));
            });
    });
});


describe('RoverInitialStateParser', function () {
    [
        {
            initialState: "1 2 N",
            expectedX: 1,
            expectedY: 2,
            expectedDirection: Direction.N
        },
        {
            initialState: "3 3 E",
            expectedX: 3,
            expectedY: 3,
            expectedDirection: Direction.E
        },
    ].forEach(function (test) {
        it(desc("parse()", test),
            function () {
                let parser = new RoverInitialStateParser();
                let result = parser.parse(test.initialState);

                expect(result.direction).toBe(test.expectedDirection);
                expect(result.position.x).toBe(test.expectedX);
                expect(result.position.y).toBe(test.expectedY);
            });
    });

    [
        {
            actions: "KLM",
            expectedErrorMessage: "Action not supported: K"
        },
        {
            actions: "MRLS",
            expectedErrorMessage: "Action not supported: S"
        }
    ].forEach(function (test) {
        it(desc("parse()", test),
            function () {
                let parser = new RoverActionParser();

                expect(function () {
                    parser.parse(test.actions);
                }).toThrow(new Error(test.expectedErrorMessage));
            });
    });
});



describe('RoverStateCalculator', function () {
    [
        {
            currentState: {
                position: {
                    x: 0,
                    y: 0
                },
                direction: Direction.N
            },
            action: Action.leftTurn,
            expectedState: {
                position: {
                    x: 0,
                    y: 0
                },
                direction: Direction.W
            }
        },
        {
            currentState: {
                position: {
                    x: 0,
                    y: 0
                },
                direction: Direction.N
            },
            action: Action.move,
            expectedState: {
                position: {
                    x: 0,
                    y: 1
                },
                direction: Direction.N
            }
        },
        {
            currentState: {
                position: {
                    x: 0,
                    y: 0
                },
                direction: Direction.E
            },
            action: Action.move,
            expectedState: {
                position: {
                    x: 1,
                    y: 0
                },
                direction: Direction.E
            }
        },
        {
            currentState: {
                position: {
                    x: 4,
                    y: 5
                },
                direction: Direction.N
            },
            action: Action.move,
            expectedState: {
                position: {
                    x: 4,
                    y: 5
                },
                direction: Direction.N
            }
        },
        {
            currentState: {
                position: {
                    x: 4,
                    y: 5
                },
                direction: Direction.E
            },
            action: Action.move,
            expectedState: {
                position: {
                    x: 4,
                    y: 5
                },
                direction: Direction.E
            }
        }
    ].forEach(function (test) {
        it(desc("action()", test),
            function () {
                let calculator = new RoverStateCalculator(new DirectionCalculator(), new PositionCalculator());
                let result = calculator.action(test.currentState, new Position(4, 5), test.action);

                expect(JSON.stringify(result)).toBe(JSON.stringify(test.expectedState));
            });
    });

});


function desc(functionName, testData) {
    // Jasmine "it()" function does not like double quote as parameter, so replace it with single quote
    return (functionName + " " + JSON.stringify(testData)).replace(/["]+/g, '\'');
}
