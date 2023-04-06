#include <node.h>
#include <string>

namespace demo {
  using v8::FunctionCallbackInfo;
  using v8::Exception;
  using v8::Isolate;
  using v8::Local;
  using v8::Object;
  using v8::String;
  using v8::Integer;
  using v8::Value;

  std::string testString = "fucking addon"; // value is set elsewhere.

  void Read(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

     // Check the number of arguments passed.
    if (args.Length() < 2) {
      // Throw an Error that is passed back to JavaScript
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate,
                              "Wrong number of arguments").ToLocalChecked()));
      return;
    }

    if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate,
                              "Wrong arguments").ToLocalChecked()));
      return;
    }

    double takeFrom = args[0].As<Number>()->Value();
    double takeTo = args[1].As<Number>()->Value();


    args.GetReturnValue().Set(String::NewFromUtf8(isolate, testString.c_str()).ToLocalChecked());
  }

  void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "read", Read);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
}
