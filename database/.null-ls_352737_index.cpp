#include<iostream>
#include<vector>
#include <typeinfo>

using namespace std;

class AKeyValue {
 protected:
    string key;
    const char* type;

 public:
    virtual string getKey() = 0;
    virtual void setKey(string key) = 0;
    virtual const char* getType() = 0;
};

template<class T>
class Fuild : public AKeyValue {
 protected:
    T value;

 public:
    Fuild(string key, T value) {
        this->key = key;
        this->value = value;
        this->type = typeid(T).name(); 
    }

    virtual string getKey() override {
        return this->key;
    }

    virtual void setKey(string key) override {
        this->key = key;
    }

    virtual const char* getType() override {
        return this->type;
    }

    virtual T getValue() {
       return this->value;
    }

    virtual void setValue(T value) {
        this->value = value; 
    }
};

class ASchemaFuild {
 protected:
    string _name;
    bool _isRequired;
    bool _isUnique;
    const char* _type;

 public:
    virtual void print() = 0;
    virtual string getName() = 0;
    virtual bool getRequired() = 0;
    virtual bool getUnique() = 0;
    virtual const char* getType() = 0;
};

template<class T>
class SchemaFuild : public ASchemaFuild {
 public:
    SchemaFuild() {
        this->_type = typeid(T).name();
    }

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

    const char* getType() override {
        return this->_type; 
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
    vector<ASchemaFuild*> schemaFuilds;

 public:
    explicit Schema(initializer_list<ASchemaFuild*> list)
        : schemaFuilds(list) { }

    void print() {
        for (ASchemaFuild* item : this->schemaFuilds) {
            item->print();
        }
    }

    vector<ASchemaFuild*> getSchemaFuilds() {
        return this->schemaFuilds;
    }
};


template<class T> class Model {
 protected:
    Schema *schema;

 public:
    explicit Model(Schema *schema) {
        this->schema = schema;
    }

    T findOne() {}

    void create(initializer_list<AKeyValue*> list) {
        checkData(list);
    }

    void printSchema() {
        this->schema->print();
    }

    void write() {
        
    }

 private:
    void checkName(ASchemaFuild* schemaFuild, vector<AKeyValue*> fuilds, vector<string> &errors) {
        for (AKeyValue *fuild : fuilds) {
            if (schemaFuild->getName() == fuild->getKey()) {
                return;
            }
        }
        errors.push_back("Could not find fuild with key " + schemaFuild->getName());
    }

    void checkType(ASchemaFuild* schemaFuild, vector<AKeyValue*> fuilds, vector<string> &errors) {
        for (AKeyValue *fuild : fuilds) {
            if (schemaFuild->getType() == fuild->getType()) {
                return;
            }
        }
        errors.push_back("Type in schema " + schemaFuild->getName() + " is not same as type in fuild");
    }

    void checkData(initializer_list<AKeyValue*> list) {
        vector<string> errors;
        vector<AKeyValue*> fuilds = list;
        for (ASchemaFuild* schemaFuild : this->schema->getSchemaFuilds()) {
            checkType(schemaFuild, fuilds, errors);
            checkName(schemaFuild, fuilds, errors);
        }
        for (string error : errors) {
            cout << error << endl;
        }
    }
};

class User : public Model<User> {
 public:
    explicit User(Schema *schema): Model<User>(schema) { }
};

int main() {
    Schema *userSchema = new Schema({
        (new SchemaFuild<string>)->name("id")->required(true)->unique(true),
        (new SchemaFuild<string>)->name("email")->required(true)->unique(true),
        (new SchemaFuild<string>)->name("password")->required(true),
        (new SchemaFuild<bool>)->name("isEmailConfirmed")->required(true)
    });

    Schema *bookSchema = new Schema({
        (new SchemaFuild<string>)->name("id")->required(true)->unique(true),
        (new SchemaFuild<string>)->name("content")->required(true)->unique(true),
    });

    User *user = new User(userSchema);

    user->printSchema();

    user->create({
        new Fuild<string>("id", "Hello"),
        new Fuild<string>("email", "vladilenzia227@mail.ru"),
        new Fuild<string>("password", "there is not emotion there is peace"),
        new Fuild<bool>("isEmailConfirmed", false),
    });

    AKeyValue *aKeyValue = new Fuild<string>("Hello", "there");

    // aKeyValue->getValue();

    cout << dynamic_cast<Fuild<string>*>(aKeyValue)->getValue() << endl;




    return 0;
}
