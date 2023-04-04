#include<iostream>
#include<vector>

using namespace std;

class User {
 private:
    string name;
    string sername;
    string age;
    string login;
    string password;

 public:
    User(string name, string sername, string age, string login, string password) {
        this->name = name;
        this->sername = sername;
        this->age = age;
        this->login = login;
        this->password = password;
    }

    virtual void userTicket() = 0;
};

class Session {
 private:
     int sessionStartTime;
     int sessionEndTime;
     string sessionName;

 public:
     Session(int sessionStartTime, int sessionEndTime, string sessionName) {
        this->sessionEndTime = sessionEndTime;
        this->sessionStartTime = sessionStartTime;
        this->sessionName = sessionName;
     }
};

class Ticket {
 private:
    Session *sessionName;
    int place;
    int row;

 public:
    Ticket(Session session, int place, int row) {
        this->sessionName = &session;
        this->place = place;
        this->row = row;
    }
};

class Viewer {
 private:
    Ticket ticket;
};

class Theater {
 private:
     string theaterName;


 public:
    Theater(string theaterName) {
        this->theaterName = theaterName;
    }

    const int amountOfPlacesPerRow = 10;

    void createPerformance(string name) {
        Session *session = new Session(12.00, 13.00, name);
        vector<Ticket> freeTickets = this->initilizeTickets(*session);
        vector<Ticket> occupiedTickets;
    }

    void getFreeTickets() {
        
    }

 private:
    vector<Ticket> initilizeTickets(Session session) {
        vector<Ticket> tickets;
        for (int row = 1, place = 1; row < 10; place++) {
            Ticket *ticket;
            ticket = new Ticket(session, place, row);
            if (place % this->amountOfPlacesPerRow == 0) {
                row++;
                place = 1;
            }
            tickets.push_back(*ticket);
        }
        return tickets;
    }
};

int main() {
    Theater *theater = new Theater("Большой Калужский театр");
    theater->createPerformance("In the code we trust");
    return 0;
}
