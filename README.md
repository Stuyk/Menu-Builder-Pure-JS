# Menu-Builder
A menu tool for GTA:Network

---

#### Like the resource?

Donate a few bucks: https://www.paypal.me/stuyk

---

### Brief how to use it:

```
// This sets up your menu with how many pages you want to use.
resource.menu_builder.setupMenu(pageAmount);
// Page, Grid Start X, Grid Start Y, Grid Width, Grid Height, HeaderType?, Text
let panel = resource.menu_builder.createPanel(0, 1, 1, 2, 2, false, "Test");
// Page Number, Grid X, Grid Y, Width, Height, Type, "Text"
let button = resource.menu_builder.createButton(0, 16, 11, 4, 1, 0, "NextPage"); 
args = [1]; // Deposit is on Index 1.
button.addArgs(args); // Push our array of arguments to the function. These are optional btw.
button.function(resource.menu_builder.nextPage) // Can also do setPage, prevPage
// Show Cursor, Hide Chat, Hide Hud, Blur It?, Disable Chat Access
resource.menu_builder.openMenu(true, false, false, true, false);
```

Another Example

```
// Setup our menu.
resource.menu_builder.setupMenu(1); // Setup at Index 0;
let currentPage = 0;                // Set a local variable for the page we're working on.

// Create a Heading Panel
let panel = resource.menu_builder.createPanel(currentPage, 12, 4, 8, 2, true, "Header"); // Page Number, Start X, Start Y, Width, Height, isHeading?, Text/String
panel.setCentered(); // Center our text.

// Create a Normal Panel
let string_message = "My Test Message";
panel = resource.menu_builder.createPanel(currentPage, 12, 6, 8, 2, false, string_message);
panel.setCentered();
// Create a Filler Panel
panel = resource.menu_builder.createPanel(currentPage, 12, 8, 8, 2, false, "http://www.stuyk.com/ ~n~ Stuyk - 2017 - Trevor W.");
panel.setCentered();

// Create an Agreement Button.
let agree = resource.menu_builder.createButton(currentPage, 12, 10, 4, 1, 1, "Agree");
agree.function(navigateShowLogin);
// Create a Disagree Button.
let disagree = resource.menu_builder.createButton(currentPage, 16, 10, 4, 1, 3, "Disagree");
disagree.function(resource.menu_eula.menu_Eula_Disconnect);

// Open our menu.
resource.menu_builder.openMenu(true, false, false, true, false);
```

If you would like to really learn how to use this resource. You're going to have to look at the functions near the bottom and study the different methods you can access inside of the classes.
