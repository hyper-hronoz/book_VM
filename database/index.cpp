#include<iostream>
#include <stack>
#include <typeinfo>


using namespace std;

class AbstractSchemaFuild {
 public:
    virtual void print() = 0;
    virtual string getName() = 0;
    virtual bool getRequired() = 0;
    virtual bool getUnique() = 0;
};

template<class T>
class SchemaFuild : public AbstractSchemaFuild {
 private:
    string _name;
    T _type;
    bool _isRequired;
    bool _isUnique;

 public:
    SchemaFuild* name(string name) {
        this->_name = name; 
        return this; 
    };

    SchemaFuild* required(bool value=false) {
        this->_isRequired = value; 
        return this;
    }

    SchemaFuild* unique(bool value=false) {
        this->_isUnique = value;
        return this;
    }

    void print() override {
        cout << "{" << "\n" <<
                    this->_name << ","  << "\n" <<
                    this->_isUnique << ","  << "\n" <<
                    this->_isRequired << ","  << "\n" <<
                    this->_type << ","  << "\n" <<
                "}" << endl;
    }

    string getName() override {
        return "hello";
    }

    bool getUnique() override {
        return false;
    }

    bool getRequired() override {
        return false;
    }
};

template <class U>
class Schema{
public:
    vector<U> v;
    template <class T>
    Schema(T n) {
        v.push_back(n);
    }
    template <class T, class... T2>
    Schema(T n, T2... rest) {
        v.push_back(n);
        Schema(rest...);
    }
};

class Model {
    // Model(Schema) {
    //
    // }

    // void findOne() {
    //     
    // }
};

class User : public Model {

};

int main() {
    stack<AbstractSchemaFuild> fuilds;

    

    Schema *userSchema = new Schema<AbstractSchemaFuild>(
        (new SchemaFuild<string>())->name("id")->required(true)->unique(true),
        (new SchemaFuild<string>())->name("email")->required(true)->unique(true),
        (new SchemaFuild<string>())->name("password")->required(true),
        (new SchemaFuild<string>())->name("email")->required(true)->unique(true),
        (new SchemaFuild<bool>())->name("isEmailConfirmed")->required(true)
    );

    return 0;
}
