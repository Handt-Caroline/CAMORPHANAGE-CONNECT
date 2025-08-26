This is a perfect Visit tracking backend ,Praise …. Push it in your GitHub account ….remember guys ,this is backend                          # ==========================
# VISITOR LOGGING PROGRAM
# ==========================
# This program allows you to log visitor names along with the current date,
# and also view all logged visits. It uses a text file ("visits_log.txt")
# to save and read the visitor information.

# --------------------------
# STEP 1: Import a module
# --------------------------
import datetime  # The datetime module lets us work with dates and times

# --------------------------
# STEP 2: Define a function to log a visit
# --------------------------
def log_visit(visitor_name):
    """
    Logs the visit of a visitor with today's date.
    This function saves the data into a text file (visits_log.txt).
    """

    visit_date = datetime.date.today()  
    # datetime.date.today() → gets the current date (e.g., 2025-08-26)

    # Open a file called "visits_log.txt" in append mode ("a")
    # Append mode means new data will be added at the end of the file,
    # without deleting what is already inside.
    # encoding="utf-8" helps handle names with special characters.
    with open('visits_log.txt', 'a', encoding='utf-8') as file:
        # Write the visitor’s name and the date into the file.
        # Example: "Caroline, 2025-08-26"
        file.write(f"{visitor_name}, {visit_date}\n")

    # Print a confirmation message to the terminal so the user knows it worked
    print(f"Visit logged for {visitor_name} on {visit_date}.")

# --------------------------
# STEP 3: Define a function to view visits
# --------------------------
def view_visits():
    """
    Displays all visits that have been logged so far.
    Reads from the visits_log.txt file and shows the data in the terminal.
    """
    try:
        # Try to open "visits_log.txt" in read mode ("r").
        with open('visits_log.txt', 'r', encoding='utf-8') as file:
            visits = file.readlines()  
            # .readlines() reads all lines in the file into a list.
            # Example: ["Caroline, 2025-08-26\n", "Praise, 2025-08-27\n"]

            print("\n📖 Visit Log:")  # Print a heading

            # Loop through each line (each visit) in the list
            for visit in visits:
                # .strip() removes extra spaces or newlines at the end of each line
                # Print the visit in a clean format
                print(" - " + visit.strip())
    except FileNotFoundError:
        # If the file "visits_log.txt" does not exist yet, show this message
        print(" No visits logged yet.")

# --------------------------
# STEP 4: Main program loop
# --------------------------
# The following code runs again and again until the user types "exit"
while True:  
    # Ask the user what they want to do
    # .strip() removes extra spaces
    # .lower() makes the input lowercase (so 'LOG', 'Log', 'log' all work)
    action = input(
        "\nEnter 'log' to log a visit, 'view' to see visits, or 'exit' to quit: "
    ).strip().lower()

    if action == 'log':
        # If the user chooses "log", ask them for the visitor’s name
        name = input("Enter visitor's name: ")
        # Call the log_visit() function to save the name with the date
        log_visit(name)

    elif action == 'view':
        # If the user chooses "view", call the function that displays visits
        view_visits()

    elif action == 'exit':
        # If the user chooses "exit", show a goodbye message and break the loop
        print("Goodbye! ")
        break  # Exit the while loop → program ends

    else:
        # If the user types something invalid (not log/view/exit),
        # show an error message and repeat the loop
        print(" Invalid input. Please try again.")