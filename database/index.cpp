#include<iostream>
#include<fstream>
#include<map>
#include<vector>
#include<typeinfo>

using namespace std;


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

  virtual ~ASchemaFuild() {}
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
      return this->_isUnique;
  }

  bool getRequired() override {
      return this->_isRequired;
  }
};

class Schema{
 private:
  vector<ASchemaFuild*> schemaFuilds;

 public:
  explicit Schema(initializer_list<ASchemaFuild*> list)
      : schemaFuilds(list) {}

  void print() {
    for (ASchemaFuild* item : this->schemaFuilds) {
        item->print();
    }
  }

  virtual ~Schema() {
    for (auto &item : this->schemaFuilds) {
      delete item;
    }
    this->schemaFuilds.clear();
  }

  vector<ASchemaFuild*> getSchemaFuilds() const {
      return this->schemaFuilds;
  }
};


class AFieldORM {
 protected:
  string key;
  const char* type;
 public:
  virtual ~AFieldORM() {}
  virtual void save(ofstream &stream) = 0;
  virtual void get(ifstream &stream) = 0;

  AFieldORM(const string& key, const char *type) : key(key), type(type) {}

  string getKey() {
    return this->key;
  }

  const char* getType() {
    return this->type;
  }
};

class Storage {
  const std::string DB_FOLDER = "./database/";

 private:
  Storage() {}
  Storage(const Storage&);
  Storage& operator=(Storage&);

 public:
  static Storage& getInstance() {
      static Storage instance;
      return instance;
  }

  void save(AFieldORM *model) {
    system("mkdir -p ./database");

    ofstream file(DB_FOLDER +
    static_cast<std::string> (typeid(model).name()),
    std::ios::out | std::ios::binary);

    model->save(file);

    file.close();
  }
};

template<class T>
class BaseFuild : public AFieldORM {
 protected:
  T value;

 public:
  BaseFuild(const string& key, const T& value) :
    AFieldORM(key, typeid(T).name()), value(value) {}

  T getValue() {
    return this->value;
  }

  virtual void save(ofstream &stream) = 0;
  virtual void get(ifstream &stream) = 0;
};

class BaseORM {
 protected:
  vector<AFieldORM*> fields;
  const Schema &schema;

 private:
  virtual void save() {
    for (auto &f : fields) {
      Storage::getInstance().save(f);
    }
  }

  void checkData(vector<string> &errors) {
    for (auto &schemaFeild : this->schema.getSchemaFuilds()) {
      bool isMatchNames = false;
      for (auto &field : this->fields) {
        if (schemaFeild->getName() == field->getKey()) {
          isMatchNames = true;
        }
      }

      bool isMatchTypes = false;
      for (auto &field : this->fields) {
        if (schemaFeild->getType() == field->getType() && isMatchNames) {
          isMatchTypes = true;
        }
      }

      if (!isMatchNames && schemaFeild->getRequired() == true) {
        errors.push_back("No such field: " + schemaFeild->getName());
      }

      if (!isMatchTypes) {
        errors.push_back("No such type: " + schemaFeild->getName());
      }
    }
  }

 public:
  explicit BaseORM(const Schema &schema) : schema(schema) {}

  void create(initializer_list<AFieldORM*> list) {
    vector<string> errors{};
    this->fields = list;
    this->checkData(errors);
    if (errors.size() == 0) {
      this->save();
    } else {
      for (auto &message : errors) {
        cout << message << endl;
      }
    }
  }

  virtual ~BaseORM() {
    for (auto &f : fields) {
      delete f;
    }
  }

  virtual void get() {
    // for (auto &f : fields) {
    //   f->get();
    // }
  }
};

class StringFieldORM : public BaseFuild<string> {
 public:
  explicit StringFieldORM(const string &key, const string &value) :
    BaseFuild(key, value) {}

  void save(ofstream &stream) override {
  };

  void get(ifstream &stream) override{
  };
};

class IntFieldORM : public BaseFuild<int> {
 public:
  explicit IntFieldORM(const string &key, const int &value) :
    BaseFuild(key, value) {}

  void save(ofstream &stream) override {
  };

  void get(ifstream &stream) override {
  };
};

class BoolFieldORM : public BaseFuild<bool> {
 public:
  explicit BoolFieldORM(const string &key, const bool &value) :
    BaseFuild(key, value) {}

  void save(ofstream &stream) override {
  };

  void get(ifstream &stream) override {
  };
};

class UserProfile: public BaseORM {
 public:
  explicit UserProfile(const Schema &schema) : BaseORM(schema) {}
};

int main() {
  Schema userSchema({
    (new SchemaFuild<string>)->name("id")->required(true)->unique(true),
    (new SchemaFuild<string>)->name("email")->required(true)->unique(true),
    (new SchemaFuild<string>)->name("password")->required(true),
    (new SchemaFuild<bool>)->name("isEmailConfirmed")->required(true)
  });

  UserProfile user(userSchema);

  user.create({
    new StringFieldORM("id", "that is id"),
    new StringFieldORM("email", "that is email"),
    new StringFieldORM("password", "that is password"),
    new BoolFieldORM("isEmailConfirmed", false)
  });

  return 0;
}

