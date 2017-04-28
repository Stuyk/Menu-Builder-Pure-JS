var screenX = API.getScreenResolutionMantainRatio().Width;
var screenY = API.getScreenResolutionMantainRatio().Height;
// Built for 16:9
var panelMinX = (screenX / 32); // 1920 = 128
var panelMinY = (screenY / 18); // 1080 = 120
// Menu Elements
var debugTest = true;
var button = null;
var panel = null;
var image = null;
var menuElements = [];
var currentPage = 0;
var padding = 10;
// Set to True when your menu is ready.
var menuIsReady = false;
var selectedInput = null;

class PanelImage {
    _xPos: number;
    _yPos: number;
    _width: number;
    _height: number;
    _path: string;

    constructor(path, x, y, width, height) {
        this._path = path;
        this._xPos = x * panelMinX;
        this._yPos = y * panelMinY;
        this._width = width * panelMinX;
        this._height = height * panelMinY
    }

    draw() {
        API.dxDrawTexture(this._path, new Point(this._xPos, this._yPos), new Size(this._width, this._height), 0);
    }

    isHovered() {
        return;
    }

    isClicked() {
        return;
    }

    returnType() {
        return "PanelImage";
    }
}

class Panel {
    _xPos: number;
    _yPos: number;
    _width: number;
    _height: number;
    _text: string;
    _header: boolean;
    _textScale: number;
    _centered: boolean;
    _fontScale: number;
    _centeredVertically: boolean;

    constructor(x, y, width, height, isHeader, text) {
        this._xPos = x * panelMinX;
        this._yPos = y * panelMinY;
        this._width = width * panelMinX;
        this._height = height * panelMinY
        this._text = text;
        this._header = isHeader;
        this._textScale = (panelMinY / (panelMinY * 10)) * height;
        this._fontScale = (panelMinY / (panelMinY * 10)) * height + 0.2;
        this._centered = false;
        this._centeredVertically = false;

        if (this._textScale > 0.6) {
            this._textScale = 0.6;
        }

        if (this._fontScale > 0.6) {
            this._fontScale = 0.6;
        }
    }

    draw() {
        if (this._header) {
            // If it's centered.
            if (this._centered || this._centeredVertically) {
                if (this._centered && this._centeredVertically) {
                    API.drawText(this._text, this._xPos + (this._width / 2), this._yPos + (this._height / 2) + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 1, false, false, this._width - padding);
                } else if (this._centered) {
                    API.drawText(this._text, this._xPos + (this._width / 2), this._yPos + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 1, false, false, this._width - padding);
                } else if (this._centeredVertically) {
                    API.drawText(this._text, this._xPos + padding, this._yPos + (this._height / 2) + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 0, false, false, this._width - padding);
                }
            } else {
                API.drawText(this._text, this._xPos + padding, this._yPos + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 0, false, false, this._width - padding);
            }

            API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 225);
            API.drawRectangle(this._xPos, this._yPos + this._height - 5, this._width, 5, 255, 255, 255, 50);
        } else {
            if (this._centered || this._centeredVertically) {
                if (this._centered && this._centeredVertically) {
                    API.drawText(this._text, this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 20, this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 1, false, false, this._width - padding);
                } else if (this._centered) {
                    API.drawText(this._text, this._xPos + (this._width / 2), this._yPos + (this._height / 4), this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 1, false, false, this._width - padding);
                } else if (this._centeredVertically) {
                    API.drawText(this._text, this._xPos + padding, this._yPos + (this._height / 2) + (this._height / 4), this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 0, false, false, this._width - padding);
                }
            } else {
                API.drawText(this._text, this._xPos + padding, this._yPos + (this._height / 4), this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 0, false, false, this._width - padding);
            }

            API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 200);
        }
    }

    setTextScale(value) {
        this._textScale = value;
    }

    setFontScale(value) {
        this._fontScale = value;
    }

    setVerticalCentered() {
        this._centeredVertically = true;
    }

    setCentered() {
        this._centered = true;
    }

    isHovered() {
        return;
    }

    isClicked() {
        return;
    }

    returnType() {
        return "Panel";
    }
}

class InputPanel {
    _xPos: number;
    _yPos: number;
    _width: number;
    _height: number;
    _input: string;
    _protected: boolean;
    _hovered: boolean;
    _selected: boolean;
    _numeric: boolean;
    _isError: boolean;

    constructor(x, y, width, height, isPasswordProtected, isSelected) {
        this._xPos = x * panelMinX;
        this._yPos = y * panelMinY;
        this._width = width * panelMinX;
        this._height = height * panelMinY;
        this._protected = isPasswordProtected;
        this._input = "";
        this._hovered = false;
        this._selected = isSelected;
        this._numeric = false;
        this._isError = false;
    }

    draw() {
        if (this._selected) {
            API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 175); // Darker Black
            API.drawRectangle(this._xPos + 10, this._yPos + 10, this._width - 20, this._height - 20, 255, 255, 255, 200);
            if (this._protected) {
                if (this._input.length < 1) {
                    return;
                }
                API.drawText("*".repeat(this._input.length), this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.4, 0, 0, 0, 255, 4, 1, false, false, (panelMinX * this._width));
            } else {
                API.drawText(this._input, this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.4, 0, 0, 0, 255, 4, 1, false, false, (panelMinX * this._width));
            }
            
            return;
        }

        if (this._hovered) { // Hovered
            API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 175); // Darker Black
            if (this._isError) {
                API.drawRectangle(this._xPos + 10, this._yPos + 10, this._width - 20, this._height - 20, 255, 0, 0, 100);
            } else {
                API.drawRectangle(this._xPos + 10, this._yPos + 10, this._width - 20, this._height - 20, 255, 255, 255, 150);
            }
            
            if (this._protected) {
                if (this._input.length < 1) {
                    return;
                }
                API.drawText("*".repeat(this._input.length), this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.4, 0, 0, 0, 255, 4, 1, false, false, (panelMinX * this._width));
            } else {
                API.drawText(this._input, this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.4, 0, 0, 0, 255, 4, 1, false, false, (panelMinX * this._width));
            }
            //API.drawText(this._input, this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.5, this.r, this.g, this.b, 255, 4, 1, false, false, (panelMinX * this.Width));
        } else { // Not Hovered
            API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 175); // Black
            if (this._isError) {
                API.drawRectangle(this._xPos + 10, this._yPos + 10, this._width - 20, this._height - 20, 255, 0, 0, 100);
            } else {
                API.drawRectangle(this._xPos + 10, this._yPos + 10, this._width - 20, this._height - 20, 255, 255, 255, 100);
            }
            if (this._protected) {
                if (this._input.length < 1) {
                    return;
                }
                API.drawText("*".repeat(this._input.length), this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.4, 0, 0, 0, 255, 4, 1, false, false, (panelMinX * this._width));
            } else {
                API.drawText(this._input, this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.4, 0, 0, 0, 255, 4, 1, false, false, (panelMinX * this._width));
            }
            //API.drawText(this._input, this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 14, 0.5, this.r, this.g, this.b, 50, 4, 1, false, false, (panelMinX * this.Width));
        }
    }

    isHovered() {
        if (API.isCursorShown()) {
            let cursorPos = API.getCursorPositionMantainRatio();
            if (cursorPos.X > this._xPos && cursorPos.X < (this._xPos + this._width) && cursorPos.Y > this._yPos && cursorPos.Y < (this._yPos + this._height)) {
                this._hovered = true;
            } else {
                this._hovered = false;
            }
        }
    }

    isError(value) {
        this._isError = value;
    }

    isClicked() {
        let cursorPos = API.getCursorPositionMantainRatio();
        if (cursorPos.X > this._xPos && cursorPos.X < (this._xPos + this._width) && cursorPos.Y > this._yPos && cursorPos.Y < (this._yPos + this._height)) {
            this._selected = true;
            selectedInput = this;
            return;
        } else {
            this._selected = false;
            return;
        }
    }

    addToInput(text: string) {
        if (this._input.length > 2147483647) {
            return;
        }

        if (!this._numeric) {
            this._input += text;
            return this._input;
        } else {
            if (Number.isInteger(+text)) {
                this._input += text;
                return this._input;
            }
        }
    }

    removeFromInput() {
        this._input = this._input.substring(0, this._input.length - 1);
    }

    returnInput() {
        return this._input;
    }

    setNumericOnly() {
        this._numeric = true;
    }

    returnType() {
        return "InputPanel";
    }
}

class Button {
    xPos: number;
    yPos: number;
    Width: number;
    Height: number;
    text: string;
    hovered: boolean;
    thisFunction: any;
    type: number; // 0 - Regular / 1 - Success(Green) / 2 - Danger(Orange) / 3 - Alert(Red)
    r: number;
    g: number;
    b: number;
    _args: any;

    constructor(x, y, width, height, type, t) {
        this.xPos = x * panelMinX;
        this.yPos = y * panelMinY;
        this.Width = width * panelMinX;
        this.Height = height * panelMinY;
        this.text = t;
        this.hovered = false;
        this.type = type;
        this._args = null;

        switch (type) {
            case 0: // Regular
                this.r = 255;
                this.g = 255;
                this.b = 255;
                return;
            case 1: // Success
                this.r = 0;
                this.g = 255;
                this.b = 0;
                return;
            case 2: // Danger
                this.r = 255;
                this.g = 165;
                this.b = 0;
                return;
            case 3: // Alert
                this.r = 255;
                this.g = 0;
                this.b = 0;
                return;
        }
    }

    function(obj) {
        this.thisFunction = obj;
    }

    addArgs(args) {
        this._args = args;
    }

    draw() {
        if (this.hovered) { // Hovered
            API.drawRectangle(this.xPos, this.yPos, this.Width, this.Height, 0, 0, 0, 175); // Darker Black
            API.drawRectangle(this.xPos, this.yPos + this.Height - 5, this.Width, 5, this.r, this.g, this.b, 200);
            API.drawText(this.text, this.xPos + (this.Width / 2), this.yPos + (this.Height / 2) - 14, 0.5, this.r, this.g, this.b, 255, 4, 1, false, false, (panelMinX * this.Width));
        } else { // Not Hovered
            API.drawRectangle(this.xPos, this.yPos, this.Width, this.Height, 0, 0, 0, 225); // Black
            API.drawRectangle(this.xPos, this.yPos + this.Height - 5, this.Width, 5, this.r, this.g, this.b, 50);
            API.drawText(this.text, this.xPos + (this.Width / 2), this.yPos + (this.Height / 2) - 14, 0.5, this.r, this.g, this.b, 50, 4, 1, false, false, (panelMinX * this.Width));
        }
    }

    isHovered() {
        if (API.isCursorShown()) {
            let cursorPos = API.getCursorPositionMantainRatio();
            if (cursorPos.X > this.xPos && cursorPos.X < (this.xPos + this.Width) && cursorPos.Y > this.yPos && cursorPos.Y < this.yPos + this.Height) {
                this.hovered = true;
            } else {
                this.hovered = false;
            }
        }
    }

    isClicked() {
        if (!API.isCursorShown()) {
            return;
        }

        let cursorPos = API.getCursorPositionMantainRatio();
        if (cursorPos.X > this.xPos && cursorPos.X < (this.xPos + this.Width) && cursorPos.Y > this.yPos && cursorPos.Y < this.yPos + this.Height) {
            API.playSoundFrontEnd("Click", "DLC_HEIST_HACKING_SNAKE_SOUNDS");
            if (this.thisFunction !== null) {
                this.thisFunction(this._args);
            }
        }
    }

    returnType() {
        return "Button";
    }
}

// On-Update Event -- Draws all of our stuff.
API.onUpdate.connect(function () {
    if (!menuIsReady) {
        return;
    }

    drawAllMenuElements();
});

// On-Keydown Event
API.onKeyDown.connect(function (sender, e) {
    if (!menuIsReady) {
        return;
    }

    if (selectedInput === null) {
        return;
    }

    if (e.KeyCode === Keys.Back) {
        selectedInput.removeFromInput();
        return;
    }

    let shiftOn = false;
    if (e.Shift) {
        shiftOn = true;
    }

    let keypress = "";
    switch (e.KeyCode) {
        case Keys.Space:
            keypress = " ";
            break;
        case Keys.A:
            keypress = "a";
            if (shiftOn) {
                keypress = "A";
            }
            break;
        case Keys.B:
            keypress = "b";
            if (shiftOn) {
                keypress = "B";
            }
            break;
        case Keys.C:
            keypress = "c";
            if (shiftOn) {
                keypress = "C";
            }
            break;
        case Keys.D:
            keypress = "d";
            if (shiftOn) {
                keypress = "D";
            }
            break;
        case Keys.E:
            keypress = "e";
            if (shiftOn) {
                keypress = "E";
            }
            break;
        case Keys.F:
            keypress = "f";
            if (shiftOn) {
                keypress = "F";
            }
            break;
        case Keys.G:
            keypress = "g";
            if (shiftOn) {
                keypress = "G";
            }
            break;
        case Keys.H:
            keypress = "h";
            if (shiftOn) {
                keypress = "H";
            }
            break;
        case Keys.I:
            keypress = "i";
            if (shiftOn) {
                keypress = "I";
            }
            break;
        case Keys.J:
            keypress = "j";
            if (shiftOn) {
                keypress = "J";
            }
            break;
        case Keys.K:
            keypress = "k";
            if (shiftOn) {
                keypress = "K";
            }
            break;
        case Keys.L:
            keypress = "l";
            if (shiftOn) {
                keypress = "L";
            }
            break;
        case Keys.M:
            keypress = "m";
            if (shiftOn) {
                keypress = "M";
            }
            break;
        case Keys.N:
            keypress = "n";
            if (shiftOn) {
                keypress = "N";
            }
            break;
        case Keys.O:
            keypress = "o";
            if (shiftOn) {
                keypress = "O";
            }
            break;
        case Keys.P:
            keypress = "p";
            if (shiftOn) {
                keypress = "P";
            }
            break;
        case Keys.Q:
            keypress = "q";
            if (shiftOn) {
                keypress = "Q";
            }
            break;
        case Keys.R:
            keypress = "r";
            if (shiftOn) {
                keypress = "R";
            }
            break;
        case Keys.S:
            keypress = "s";
            if (shiftOn) {
                keypress = "S";
            }
            break;
        case Keys.T:
            keypress = "t";
            if (shiftOn) {
                keypress = "T";
            }
            break;
        case Keys.U:
            keypress = "u";
            if (shiftOn) {
                keypress = "U";
            }
            break;
        case Keys.V:
            keypress = "v";
            if (shiftOn) {
                keypress = "V";
            }
            break;
        case Keys.W:
            keypress = "w";
            if (shiftOn) {
                keypress = "W";
            }
            break;
        case Keys.X:
            keypress = "x";
            if (shiftOn) {
                keypress = "X";
            }
            break;
        case Keys.Y:
            keypress = "y";
            if (shiftOn) {
                keypress = "Y";
            }
            break;
        case Keys.Z:
            keypress = "z";
            if (shiftOn) {
                keypress = "Z";
            }
            break;
        case Keys.D0:
            keypress = "0";
            if (shiftOn) {
                keypress = ")";
            }
            break;
        case Keys.D1:
            keypress = "1";
            if (shiftOn) {
                keypress = "!";
            }
            break;
        case Keys.D2:
            keypress = "2";
            if (shiftOn) {
                keypress = "@";
            }
            break;
        case Keys.D3:
            keypress = "3";
            if (shiftOn) {
                keypress = "#";
            }
            break;
        case Keys.D4:
            keypress = "4";
            if (shiftOn) {
                keypress = "$";
            }
            break;
        case Keys.D5:
            keypress = "5";
            if (shiftOn) {
                keypress = "%";
            }
            break;
        case Keys.D6:
            keypress = "6";
            if (shiftOn) {
                keypress = "^";
            }
            break;
        case Keys.D7:
            keypress = "7";
            if (shiftOn) {
                keypress = "&";
            }
            break;
        case Keys.D8:
            keypress = "8";
            if (shiftOn) {
                keypress = "*";
            }
            break;
        case Keys.D9:
            keypress = "9";
            if (shiftOn) {
                keypress = "(";
            }
            break;
        case Keys.OemMinus:
            keypress = "-";
            if (shiftOn) {
                keypress = "_";
            }
            break;
        case Keys.Oemplus:
            keypress = "=";
            if (shiftOn) {
                keypress = "+";
            }
            break;
        case Keys.OemQuestion:
            keypress = "/";
            if (shiftOn) {
                keypress = "?";
            }
            break;
        case Keys.Oemcomma:
            keypress = ",";
            if (shiftOn) {
                keypress = "<";
            }
            break;
        case Keys.OemPeriod:
            keypress = ".";
            if (shiftOn) {
                keypress = ">";
            }
            break;
        case Keys.OemSemicolon:
            keypress = ";";
            if (shiftOn) {
                keypress = ":";
            }
            break;
        case Keys.OemOpenBrackets:
            keypress = "[";
            if (shiftOn) {
                keypress = "{";
            }
            break;
        case Keys.OemCloseBrackets:
            keypress = "]";
            if (shiftOn) {
                keypress = "}";
            }
            break;
        case Keys.NumPad0:
            keypress = "0";
            break;
        case Keys.NumPad1:
            keypress = "1";
            break;
        case Keys.NumPad2:
            keypress = "2";
            break;
        case Keys.NumPad3:
            keypress = "3";
            break;
        case Keys.NumPad4:
            keypress = "4";
            break;
        case Keys.NumPad5:
            keypress = "5";
            break;
        case Keys.NumPad6:
            keypress = "6";
            break;
        case Keys.NumPad7:
            keypress = "7";
            break;
        case Keys.NumPad8:
            keypress = "8";
            break;
        case Keys.NumPad9:
            keypress = "9";
            break;
    }

    if (keypress === "") {
        return;
    }

    if (keypress.length > 0) {
        selectedInput.addToInput(keypress);
    } else {
        return;
    }
});
// Goes to Next Page
function nextPage() {
    if (currentPage + 1 > menuElements.length - 1) {
        currentPage = 0;
    } else {
        currentPage += 1;
    }
}
// Goes to Previous Page
function prevPage() {
    if (currentPage - 1 < 0) {
        currentPage = menuElements.length - 1;
    } else {
        currentPage -= 1;
    }
}
// Set Page
function setPage(value) {
    currentPage = value;
}
// Draws all elements.
function drawAllMenuElements() {
    // Check if Elements are present.
    if (menuElements.length < 1) {
        return;
    }
    // Determine if our current page has elements or not.
    if (!Array.isArray(menuElements[currentPage])) {
        return;
    }

    for (var i = 0; i < menuElements[currentPage].length; i++) {
        // This will draw each element.
        menuElements[currentPage][i].draw(); 
        // Return the type of element.
        let type = menuElements[currentPage][i].returnType(); 
        // Check for Hover Events
        switch (type) { 
            case "Button":
                menuElements[currentPage][i].isHovered();
                // Check for Click Events
                if (API.isControlJustPressed(Enums.Controls.CursorAccept)) {
                    menuElements[currentPage][i].isClicked();
                }
                break;
            case "InputPanel":
                menuElements[currentPage][i].isHovered();
                // Check for Click Events
                if (API.isControlJustPressed(Enums.Controls.CursorAccept)) {
                    menuElements[currentPage][i].isClicked();
                }
                break;
        }
    }
}

// Ready to draw the menu?
function setMenuReady(isReady: boolean) {
    menuIsReady = isReady;
}
// Setup our pages with arrays. This is the first thing we should call.
function setupMenu(numberOfPages: number) {
    for (var i = 0; i < numberOfPages; i++) {
        let emptyArray = [];
        menuElements.push(emptyArray);
    }
}
// Add a page to our pages array.
function createPanel(page: number, xStart: number, yStart: number, xGridWidth: number, yGridHeight: number, isHeaderType: boolean, text: string) {
    panel = new Panel(xStart, yStart, xGridWidth, yGridHeight, isHeaderType, text);
    menuElements[page].push(panel);
    return panel;
}
// Add a button to our pages array.
function createButton(page: number, xStart: number, yStart: number, xGridWidth: number, yGridHeight: number, type: number, text: any) {
    button = new Button(xStart, yStart, xGridWidth, yGridHeight, type, text);
    menuElements[page].push(button);
    return button;
}
// Add a static input to our pages array.
function createInput(page: number, xStart: number, yStart: number, xGridWidth: number, yGridHeight: number, isPasswordProtected: boolean, isSelected: boolean) {
    panel = new InputPanel(xStart, yStart, xGridWidth, yGridHeight, isPasswordProtected, isSelected);
    menuElements[page].push(panel);
    return panel;
}
function createImage(page: number, path: string, x: number, y: number, width: number, height: number) {
    panel = new PanelImage(path, x, y, width, height);
    menuElements[page].push(panel);
    return panel;
}
// Clears the menu entirely.
function exitMenu(cursor: boolean, hud: boolean, chat: boolean, blur: boolean, canOpenChat: boolean) {
    menuIsReady = false;
    menuElements = [];
    selectedInput = null;
    
    if (cursor) {
        API.showCursor(true);
    } else {
        API.showCursor(false);
    }

    if (hud) {
        API.setHudVisible(true);
    } else {
        API.setHudVisible(false);
    }
    
    if (chat) {
        API.setChatVisible(true);
    } else {
        API.setChatVisible(false);
    }

    if (blur) {
        API.callNative("_TRANSITION_FROM_BLURRED", 3000);
    }

    if (canOpenChat) {
        API.setCanOpenChat(true);
    } else {
        API.setCanOpenChat(false);
    }
}

function killMenu() {
    menuIsReady = false;
    menuElements = [];
    selectedInput = null;
    API.showCursor(false);
    API.setHudVisible(true);
    API.setChatVisible(true);
    API.setCanOpenChat(true);
}

function openMenu(cursor: boolean, hud: boolean, chat: boolean, blur: boolean, canOpenChat: boolean) {
    if (blur === true) {
        API.callNative("_TRANSITION_TO_BLURRED", 3000);
    }

    menuIsReady = true;

    if (cursor) {
        API.showCursor(true);
    } else {
        API.showCursor(false);
    }

    if (hud) {
        API.setHudVisible(true);
    } else {
        API.setHudVisible(false);
    }

    if (chat) {
        API.setChatVisible(true);
    } else {
        API.setChatVisible(false);
    }

    if (canOpenChat) {
        API.setCanOpenChat(true);
    } else {
        API.setCanOpenChat(false);
    }
}