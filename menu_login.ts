// Panel Variables
var menu: Menu;
var loginUsername: InputPanel;
var loginPassword: InputPanel;
var regUsername: InputPanel;
var regPassword: InputPanel;
var regConfirmPassword: InputPanel;

// Main Menu Login Panel Function
function menuLoginPanel() {
    menu = resource.menu_builder.createMenu(4);
    let panel: Panel;
    let inputPanel: InputPanel;
    let textElement: TextElement;
    // EULA Screen - Page 0
    // EULA Header Panel
    panel = menu.createPanel(0, 12, 4, 8, 1);
    panel.MainBackgroundColor(0, 0, 0, 175);
    panel.Header = true;
    textElement = panel.addText("EULA");
    textElement.Color(255, 255, 255, 255);
    textElement.Centered = true;
    textElement.VerticalCentered = true;
    textElement.FontScale = 0.6;
    textElement.Font = 1;
    // EULA Text
    panel = menu.createPanel(0, 12, 5, 8, 7);
    panel.MainBackgroundColor(0, 0, 0, 160);
    textElement = panel.addText("By clicking accept you agree not to manipulate any files recieved from this server. Violation of this contract will result in immediate termination from the server. As well as a permanent restriction of access to the server. These are regulations you must abide by in order to join and play on this server. Any files recieved from this server are prohibited usage elsewhere.");
    textElement.Color(255, 255, 255, 255);
    textElement.FontScale = 0.4;
    textElement.Font = 4;
    textElement.Centered = false;
    // EULA Button
    panel = menu.createPanel(0, 12, 12, 8, 1);
    panel.MainBackgroundColor(0, 0, 0, 160);
    panel.HoverBackgroundColor(25, 25, 25, 160);
    panel.Hoverable = true;
    panel.Function = menu.nextPage;
    panel.Tooltip = "Accept the EULA.";
    textElement = panel.addText("Accept");
    textElement.Color(255, 255, 255, 255);
    textElement.HoverColor(0, 180, 255, 255);
    textElement.Centered = true;
    textElement.VerticalCentered = true;
    // Login Screen - Page 1
    // Login Header Panel
    panel = menu.createPanel(1, 12, 4, 7, 1);
    panel.MainBackgroundColor(0, 0, 0, 175);
    panel.Header = true;
    textElement = panel.addText("Login");
    textElement.Color(255, 255, 255, 255);
    textElement.Centered = false;
    textElement.VerticalCentered = true;
    textElement.FontScale = 0.6;
    textElement.Offset = 18;
    // Go to Registration Button
    panel = menu.createPanel(1, 19, 4, 1, 1);
    panel.MainBackgroundColor(0, 0, 0, 175);
    panel.Tooltip = "New Account?";
    panel.Function = menu.nextPage;
    panel.HoverBackgroundColor(25, 25, 25, 160);
    panel.Hoverable = true;
    panel.Header = true;
    textElement = panel.addText(">");
    textElement.Color(255, 255, 255, 255);
    textElement.Centered = true;
    textElement.VerticalCentered = true;
    textElement.FontScale = 0.6;
    textElement.HoverColor(0, 180, 255, 255);
    // Login Screen Login Forms and Such
    panel = menu.createPanel(1, 12, 5, 8, 7);
    panel.MainBackgroundColor(0, 0, 0, 160);
    textElement = panel.addText("Username");
    textElement.Color(255, 255, 255, 255);
    panel.addText("");
    textElement = panel.addText("Password");
    textElement.Color(255, 255, 255, 255);
    loginUsername = panel.addInput(0, 1, 8, 1);
    loginPassword = panel.addInput(0, 3, 8, 1);
    loginPassword.Protected = true;
    // Login Screen Button
    panel = menu.createPanel(1, 12, 12, 8, 1);
    panel.MainBackgroundColor(0, 0, 0, 160);
    panel.HoverBackgroundColor(25, 25, 25, 160);
    panel.Hoverable = true;
    panel.Function = resource.menu_login.attemptLogin;
    panel.Tooltip = "Attempt to login.";
    textElement = panel.addText("Login");
    textElement.Color(255, 255, 255, 255);
    textElement.HoverColor(0, 180, 255, 255);
    textElement.Centered = true;
    textElement.VerticalCentered = true;
    // Login Screen - Page 2
    // Login Header Panel
    panel = menu.createPanel(2, 12, 4, 7, 1);
    panel.MainBackgroundColor(0, 0, 0, 175);
    panel.Header = true;
    textElement = panel.addText("Registration");
    textElement.Color(255, 255, 255, 255);
    textElement.Centered = false;
    textElement.VerticalCentered = true;
    textElement.FontScale = 0.6;
    textElement.Offset = 18;
    // Go to Login Button
    panel = menu.createPanel(2, 19, 4, 1, 1);
    panel.MainBackgroundColor(0, 0, 0, 175);
    panel.Tooltip = "Existing Account?";
    panel.Function = menu.prevPage;
    panel.HoverBackgroundColor(25, 25, 25, 160);
    panel.Hoverable = true;
    panel.Header = true;
    textElement = panel.addText("<");
    textElement.Color(255, 255, 255, 255);
    textElement.Centered = true;
    textElement.VerticalCentered = true;
    textElement.FontScale = 0.6;
    textElement.HoverColor(0, 180, 255, 255);
    // Registration Screen Login Forms and Such
    panel = menu.createPanel(2, 12, 5, 8, 7);
    panel.MainBackgroundColor(0, 0, 0, 160);
    textElement = panel.addText("Username");
    textElement.Color(255, 255, 255, 255);
    panel.addText("");
    textElement = panel.addText("Password");
    textElement.Color(255, 255, 255, 255);
    panel.addText("");
    textElement = panel.addText("Password Again");
    textElement.Color(255, 255, 255, 255);
    regUsername = panel.addInput(0, 1, 8, 1);
    regPassword = panel.addInput(0, 3, 8, 1);
    regPassword.Protected = true;
    regConfirmPassword = panel.addInput(0, 5, 8, 1);
    regConfirmPassword.Protected = true;
    // Registration Screen Button
    panel = menu.createPanel(2, 12, 12, 8, 1);
    panel.MainBackgroundColor(0, 0, 0, 160);
    panel.HoverBackgroundColor(25, 25, 25, 160);
    panel.Hoverable = true;
    panel.Function = resource.menu_login.attemptRegister;
    panel.Tooltip = "Attempt to register a new account.";
    textElement = panel.addText("Register");
    textElement.Color(255, 255, 255, 255);
    textElement.HoverColor(0, 180, 255, 255);
    textElement.Centered = true;
    textElement.VerticalCentered = true;
    // Menu is now ready, parse it and draw it.
    menu.Blur = true;
    menu.DisableOverlays(true);
    menu.Ready = true;
}

function attemptLogin() {
    let user = loginUsername.Input;
    let pass = loginPassword.Input;
    if (user.length < 5) {
        loginUsername.isError = true;
        return;
    }
    loginUsername.isError = false;
    if (pass.length < 5) {
        loginPassword.isError = true;
        return;
    } else {
        loginPassword.isError = false;
        API.triggerServerEvent("clientLogin", user, pass);
        menu.Page = 3;
        return;
    }
}

function attemptRegister() {
    let user = regUsername.Input;
    let pass = regPassword.Input;
    let pass_verify = regConfirmPassword.Input;
    if (user.length < 5) {
        regUsername.isError = true;
        return;
    }
    regUsername.isError = false;

    if (pass.length < 5 && pass_verify.length < 5) {
        regPassword.isError = true;
        regConfirmPassword.isError = true;
        return;
    }

    regPassword.isError = false;
    regConfirmPassword.isError = false;

    if (pass === pass_verify) {
        API.triggerServerEvent("clientRegistration", user, pass);
        resource.menu_builder.setPage(3);
        return;
    } else {
        regPassword.isError = true;
        regConfirmPassword.isError = true;
        return;
    }
}