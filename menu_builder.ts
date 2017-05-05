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
var notification = null;
var notifications = [];
var textnotification = null;
var textnotifications = [];
var currentPage = 0;
var padding = 10;
// Set to True when your menu is ready.
var menuIsReady = false;
var selectedInput = null;
// Animation Stuff
var animationFrames = 0;

class PlayerTextNotification {
    _xPos: number;
    _yPos: number;
    _alpha: number;
    _text: string;
    _increment: number;
    _r: number;
    _g: number;
    _b: number;
    _lastUpdateAlpha: number;
    _lastUpdateTextPosition: number;
    _drawing: boolean;

    constructor(text: string) {
        let playerPos = API.getEntityPosition(API.getLocalPlayer()).Add(new Vector3(0, 0, 1));
        let point = API.worldToScreenMantainRatio(playerPos);
        this._xPos = Point.Round(point).X;
        this._yPos = Point.Round(point).Y;
        this._drawing = true;
        this._alpha = 255;
        this._text = text;
        this._increment = -1;
        this._lastUpdateAlpha = new Date().getTime();
        this._lastUpdateTextPosition = new Date().getTime();
        this._r = 0;
        this._g = 0;
        this._b = 0;
    }

    draw() {
        if (!this._drawing) {
            return;
        }

        if (new Date().getTime() > this._lastUpdateAlpha + 35) { // 60 FPS
            this._lastUpdateAlpha = new Date().getTime();
            this._alpha -= 5;
        }

        if (new Date().getTime() > this._lastUpdateTextPosition + 100) {
            this._yPos -= 0.3;
        }

        API.drawText(this._text, this._xPos, this._yPos, 0.4, this._r, this._g, this._b, this._alpha, 4, 1, true, true, 500);

        if (this._alpha <= 0) {
            this.cleanUpNotification();
        }
    }

    setColor(r, g, b) {
        this._r = r;
        this._g = g;
        this._b = b;
    }

    cleanUpNotification() {
        this._drawing = false;
        textnotification = null;
    }

    returnType() {
        return "PlayerTextNotification";
    }
}

class ProgressBar {
    _xPos: number;
    _yPos: number;
    _width: number;
    _height: number;
    _r: number;
    _g: number;
    _b: number;
    _currentProgress: number;

    constructor(x, y, width, height, currentProgress) {
        this._xPos = x * panelMinX;
        this._yPos = y * panelMinY;
        this._width = width * panelMinX - 10;
        this._height = height * panelMinY - 10;
        this._currentProgress = currentProgress;
        this._r = 0;
        this._g = 0;
        this._b = 0;
    }

    draw() {
        
        API.drawRectangle(this._xPos + 5, this._yPos + 5, ((this._width / 100) * this._currentProgress), this._height, this._r, this._g, this._b, 225);
        API.drawText("" + Math.round(this._currentProgress), this._xPos + (((this._width / 100) * this._currentProgress) / 2), this._yPos, 0.5, 255, 255, 255, 255, 4, 1, false, true, 100);
    }

    setColor(r, g, b) {
        this._r = r;
        this._g = g;
        this._b = b;
    }

    addProgress(value) {
        if (this._currentProgress + value > 100) {
            this._currentProgress = 100;
            return;
        }
        this._currentProgress += value; 
    }

    subtractProgress(value) {
        if (this._currentProgress - value < 0) {
            this._currentProgress = 0;
            return;
        }
        this._currentProgress -= value;
    }

    setProgressAmount(value) {
        if (value >= 100) {
            this._currentProgress = 100;
            return;
        }

        if (value <= 0) {
            this._currentProgress = 0;
            return;
        }

        this._currentProgress = value;
        return;
    }

    returnProgressAmount() {
        return this._currentProgress;
    }

    returnType() {
        return "ProgressBar";
    }
}


class Notification {
    _currentPosX: number;
    _currentPosY: number;
    _targetX: number;
    _targetY: number;
    _width: number;
    _height: number;
    _text: string;
    _r: number;
    _g: number;
    _b: number;
    _alpha: number;
    _textScale: number;
    _offset: number;
    _lastUpdateTime: number;
    _currentPhase: number;
    _displayTime: number;
    _running: boolean;
    _sound: boolean;
    _incrementer: number;

    constructor(text, displayTime) {
        this._currentPosX = 26 * panelMinX; // Starting Position
        this._currentPosY = screenY; // Starting Position Y
        this._targetX = 26 * panelMinX; // Ending Position
        this._targetY = 15 * panelMinY; // Ending Position Y
        this._width = panelMinX * 5;
        this._height = panelMinY * 3;
        // Text Settings
        this._text = text;
        this._r = 255;
        this._g = 165;
        this._b = 0;
        this._offset = 0;
        this._textScale = 0.5;
        // Animation Settings
        this._lastUpdateTime = new Date().getTime(); //ms
        this._alpha = 255;
        this._displayTime = displayTime;
        this._incrementer = 0;
        // Sound Settings
        this._sound = true;
    }

    draw() {
        if (notification !== this) {
            return;
        }

        if (this._sound) {
            this._sound = false;
            API.playSoundFrontEnd("GOLF_NEW_RECORD", "HUD_AWARDS");
        }

        // Starts below max screen.
        API.drawRectangle(this._currentPosX, this._currentPosY - 5, this._width, 5, this._r, this._g, this._b, this._alpha - 30);
        API.drawRectangle(this._currentPosX, this._currentPosY, this._width, this._height, 0, 0, 0, this._alpha - 30);
        API.drawText(this._text, this._offset + this._currentPosX + (this._width / 2), this._currentPosY + (this._height / 4), this._textScale, 255, 255, 255, this._alpha, 4, 1, false, false, this._width - padding);
        this.animate();
    }

    animate() {
        // Did we reach our goal?
        if (this._currentPosY <= this._targetY) {
            this._currentPosY = this._targetY;
            // Ready to fade?
            if (new Date().getTime() > this._lastUpdateTime + this._displayTime) {
                this.fade();
                return;
            }
            return;
        }

        this._lastUpdateTime = new Date().getTime();
        // If not let's reach our goal.
        if (this._currentPosY <= this._targetY + (this._height / 6)) {
            this._currentPosY -= 3;
            return;
        } else {
            this._currentPosY -= 5;
            return;
        }
    }

    fade() {
        if (this._alpha <= 0) {
            this.cleanUpNotification();
            return;
        }

        this._alpha -= 5;
        return;
    }

    cleanUpNotification() {
        animationFrames = 0;
        notification = null;
    }

    setText(value) {
        this._text = value;
    }

    setColor(r, g, b) {
        this._r = r;
        this._g = g;
        this._b = b;
    }

    setTextScale(value) {
        this._textScale = value;
    }

    isHovered() {
        return;
    }

    isClicked() {
        return;
    }

    returnType() {
        return "Notification";
    }
}

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
    _offset: number;

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
        this._offset = 0;

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
                    API.drawText(this._text, this._offset + this._xPos + (this._width / 2), this._yPos + (this._height / 2) + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 1, false, false, this._width - padding);
                } else if (this._centered) {
                    API.drawText(this._text, this._offset + this._xPos + (this._width / 2), this._yPos + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 1, false, false, this._width - padding);
                } else if (this._centeredVertically) {
                    API.drawText(this._text, this._offset + this._xPos + padding, this._yPos + (this._height / 2) + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 0, false, false, this._width - padding);
                }
            } else {
                API.drawText(this._text, this._offset + this._xPos + padding, this._yPos + (this._height / 4), this._textScale * 5, 255, 255, 255, 255, 1, 0, false, false, this._width - padding);
            }

            API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 225);
            API.drawRectangle(this._xPos, this._yPos + this._height - 5, this._width, 5, 255, 255, 255, 50);
        } else {
            if (this._centered || this._centeredVertically) {
                if (this._centered && this._centeredVertically) {
                    API.drawText(this._text, this._offset + this._xPos + (this._width / 2), this._yPos + (this._height / 2) - 20, this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 1, false, false, this._width - padding);
                } else if (this._centered) {
                    API.drawText(this._text, this._offset + this._xPos + (this._width / 2), this._yPos + (this._height / 4), this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 1, false, false, this._width - padding);
                } else if (this._centeredVertically) {
                    API.drawText(this._text, this._offset + this._xPos + padding, this._yPos + (this._height / 2) + (this._height / 4), this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 0, false, false, this._width - padding);
                }
            } else {
                API.drawText(this._text, this._offset + this._xPos + padding, this._yPos + (this._height / 4), this._fontScale - (this._fontScale / 4), 255, 255, 255, 255, 4, 0, false, false, this._width - padding);
            }

            API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 225);
        }
    }

    setText(value) {
        this._text = value;
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

    setOffset(value) {
        this._offset = value;
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
    _isTransparent: boolean;

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
        this._isTransparent = false;
    }

    draw() {
        if (this._selected) {
            if (!this._isTransparent) {
                API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 225); // Darker Black
            }
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
            if (!this._isTransparent) {
                API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 225); // Darker Black
            }
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
            if (!this._isTransparent) {
                API.drawRectangle(this._xPos, this._yPos, this._width, this._height, 0, 0, 0, 225); // Darker Black
            }
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

    setSelected() {
        selectedInput = this;
        this._selected = true;
    }

    setUnselected() {
        this._selected = false;
    }

    setTransparent() {
        this._isTransparent = true;
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

    setInput(value) {
        this._input = value;
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
    _tooltip: string;
    _hoverTime: number;

    constructor(x, y, width, height, type, t) {
        this.xPos = x * panelMinX;
        this.yPos = y * panelMinY;
        this.Width = width * panelMinX;
        this.Height = height * panelMinY;
        this.text = t;
        this.hovered = false;
        this.type = type;
        this._args = null;
        this._hoverTime = 0;
        this._tooltip = "";

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

    setTooltip(value) {
        this._tooltip = value;
    }

    draw() {
        if (this.hovered) { // Hovered
            API.drawRectangle(this.xPos, this.yPos, this.Width, this.Height, 0, 0, 0, 200); // Lighter
            API.drawRectangle(this.xPos, this.yPos + this.Height - 5, this.Width, 5, this.r, this.g, this.b, 200);
            API.drawText(this.text, this.xPos + (this.Width / 2), this.yPos + (this.Height / 2) - 14, 0.5, this.r, this.g, this.b, 255, 4, 1, false, false, (panelMinX * this.Width));
        } else { // Not Hovered
            API.drawRectangle(this.xPos, this.yPos, this.Width, this.Height, 0, 0, 0, 225); // Black
            API.drawRectangle(this.xPos, this.yPos + this.Height - 5, this.Width, 5, this.r, this.g, this.b, 50);
            API.drawText(this.text, this.xPos + (this.Width / 2), this.yPos + (this.Height / 2) - 14, 0.5, this.r, this.g, this.b, 255, 4, 1, false, false, (panelMinX * this.Width));
        }
    }

    isHovered() {
        if (API.isCursorShown()) {
            let cursorPos = API.getCursorPositionMantainRatio();
            if (cursorPos.X > this.xPos && cursorPos.X < (this.xPos + this.Width) && cursorPos.Y > this.yPos && cursorPos.Y < this.yPos + this.Height) {
                this.hovered = true;
                this._hoverTime += 1;

                if (this._hoverTime > 50) {
                    API.drawText(this._tooltip, cursorPos.X + 25, cursorPos.Y, 0.4, 255, 255, 255, 255, 4, 0, true, true, 200);
                }
            } else {
                this.hovered = false;
                this._hoverTime = 0;
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
    // Notifications can be global.
    drawNotification();
    drawTextNotification();

    if (!menuIsReady) {
        return;
    }

    if (menuElements.length === 0) {
        return;
    }

    if (menuElements[currentPage].length === 0) {
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
function drawTextNotification() {
    if (textnotification !== null) {
        textnotification.draw();
        return;
    }

    if (textnotifications.length <= 0) {
        return;
    }

    textnotification = textnotifications.shift();
    return;
}
function drawNotification() {
    if (notification !== null) {
        notification.draw();
        return;
    }

    if (notifications.length <= 0) {
        return;
    }

    notification = notifications.shift();
    return;
}
// Draws all elements.
function drawAllMenuElements() {
    if (!menuIsReady) {
        return;
    }

    if (Array.isArray(menuElements[currentPage])) {
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
function createNotification(page: number, text: string, displayTime: number) {
    // Add to queue.
    let notify = new Notification(text, displayTime);
    notifications.push(notify);
    return notify;
}
function createPlayerTextNotification(text: string) {
    let notify = new PlayerTextNotification(text);
    textnotifications.push(notify);
    return notify;
}
function createProgressBar(page: number, x: number, y: number, width: number, height: number, currentProgress: number) {
    let bar = new ProgressBar(x, y, width, height, currentProgress);
    menuElements[page].push(bar);
    return bar;
}   
function getCurrentPage() {
    return currentPage;
}
// Clears the menu entirely.
function exitMenu(cursor: boolean, hud: boolean, chat: boolean, blur: boolean, canOpenChat: boolean) {
    menuIsReady = false;
    
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

    menuElements = [[]];
    selectedInput = null;
    currentPage = 0;
}

function killMenu() {
    menuIsReady = false;
    selectedInput = null;
    API.showCursor(false);
    API.setHudVisible(true);
    API.setChatVisible(true);
    API.setCanOpenChat(true);
    API.callNative("_TRANSITION_FROM_BLURRED", 3000);
    menuElements = [[]];
    currentPage = 0;
}

function openMenu(cursor: boolean, hud: boolean, chat: boolean, blur: boolean, canOpenChat: boolean) {
    if (blur === true) {
        API.callNative("_TRANSITION_TO_BLURRED", 3000);
    }

    currentPage = 0;
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