#include<iostream>
#include<vector>
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
    const char* _type = typeid(T).name();
    bool _isRequired;
    bool _isUnique;

 public:
    SchemaFuild* name(string name) {
        this->_name = name;
        return this;
    }

    SchemaFuild* required(bool value = false) {
        this->_isRequired = value;
        return this;
    }

    SchemaFuild* unique(bool value = false) {
        this->_isUnique = value;
        return this;
    }

    void print() override {
        cout << "{" << "\n" <<
           "     " << "name: " << this->_name << ","  << "\n" <<
           "     " << "unique: " << this->_isUnique << ","  << "\n" <<
           "     " << "required: " << this->_isRequired << ","  << "\n" <<
           "     " << "type: " << this->_type << "\n" <<
        "}" << ',' << endl;
    }

    string getName() override {
        return this->_name;
    }

    bool getUnique() override {
        return false;
    }

    bool getRequired() override {
        return false;
    }
};

class Schema{
 private:
    vector<AbstractSchemaFuild*> schemaFuilds;

 public:
    explicit Schema(initializer_list<AbstractSchemaFuild*> list)
        : schemaFuilds(list) { }

    // ~Schema() {
    //     cout << "Distroyed" << endl;
    //     this->schemaFuilds.clear();
    // }

    void print() {
        for (AbstractSchemaFuild* item : this->schemaFuilds) {
            item->print();
        }
    }

    vector<AbstractSchemaFuild*> getSchemaFuilds() {
        return this->schemaFuilds;
    }
};

struct KeyValue {
    string key;
    string value;
};

template<class T>
class Model {
 protected:
    Schema *schema;
    vector<KeyValue> fuilds;

 public:
    explicit Model(Schema *schema) {
        this->schema = schema;
    }

    explicit Model(initializer_list<KeyValue> list) : fuilds(list) {
    }

    T findOne() {
    }

 private:
    void checkData() {
        for (AbstractSchemaFuild* item : this->schema->getSchemaFuilds()) {
        }
    }
};

class User : public Model<User> {
 public:
    explicit User(Schema *schema): Model<User>(schema) {}

    void check() {
        this->schema->print();
    }
};

int main() {
    Schema *userSchema = new Schema({
        (new SchemaFuild<string>)->name("id")->required(true)->unique(true),
        (new SchemaFuild<string>)->name("email")->required(true)->unique(true),
        (new SchemaFuild<string>)->name("password")->required(true),
        (new SchemaFuild<string>)->name("email")->required(true)->unique(true),
        (new SchemaFuild<bool>)->name("isEmailConfirmed")->required(true)
    });

    User *user = new User(userSchema);
    user->check();

    return 0;
}
