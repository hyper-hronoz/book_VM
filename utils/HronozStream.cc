#include <fstream>
#include <iostream>
#include <node.h>
#include <string>

using namespace v8;

namespace demo {
using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

std::string testString = "fucking addon"; // value is set elsewhere.

vector<string> split(string str, string token){
    vector<string>result;
    while(str.size()){
        int index = str.find(token);
        if(index!=string::npos){
            result.push_back(str.substr(0,index));
            str = str.substr(index+token.size());
            if(str.size()==0)result.push_back(str);
        }else{
            result.push_back(str);
            str = "";
        }
    }
    return result;
}

void Read(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();

  // Check the number of arguments passed.
  if (args.Length() < 3) {
    // Throw an Error that is passed back to JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong number of arguments")
            .ToLocalChecked()));
    return;
  }

  if (!args[0]->IsString() || !args[1]->IsNumber() || !args[2]->IsNumber) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
    return;
  }

  String::Utf8Value fileName(isolate, args[0]);
  int page = args[1].As<Number>()->Value();
  int maxSymbols = args[2].As<Number>()->Value();

  std::cout << "File name: " << *fileName << std::endl;

  std::ifstream file(*fileName, std::ios::in);

  if (!file.is_open()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "File was not found").ToLocalChecked()));
  }

  std::string text((std::istreambuf_iterator<char>(file)),
                   std::istreambuf_iterator<char>());

  std::vector<std::string> words = split(text, " ");

  std::string response{};

  int tempPageCounter = 0;
  for (std::string word : words) {
    if (response.length() + word.length() <= maxSymbols) {
      if (page == 0) {
        break;
      }
      response += word;
    }
    if (response.length() + word.length() > maxSymbols) {
      tempPageCounter++; 
      response = "";
    }
    if (response.length() + word.length() <= maxSymbols && tempPageCounter == page) {
      response += word; 
    }
  }

  args.GetReturnValue().Set(
      String::NewFromUtf8(isolate, response.c_str()).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "read", Read);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
} 
