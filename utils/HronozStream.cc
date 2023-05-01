#include <fstream>
#include <iostream>
#include <node.h>
#include <string>
#include <vector>

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

using namespace std;

std::vector<std::string> split(std::string str, std::string token) {
  std::vector<std::string> result;
  while (str.size()) {
    int index = str.find(token);
    if (index != std::string::npos) {
      result.push_back(str.substr(0, index));
      str = str.substr(index + token.size());
      if (str.size() == 0)
        result.push_back(str);
    } else {
      result.push_back(str);
      str = "";
    }
  }
  return result;
}

void Read(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();

  if (args.Length() < 3) {
    // Throw an Error that is passed back to JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong number of arguments")
            .ToLocalChecked()));
    return;
  }

  if (!args[0]->IsNumber() || !args[1]->IsNumber() || !args[2]->IsString()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
    return;
  }


  int maximalSymbols = args[0].As<Number>()->Value();
  int page = args[1].As<Number>()->Value();
  String::Utf8Value fileName(isolate, args[2]);

  std::ifstream file(*fileName);

  if (!file.is_open()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "No such file or directory").ToLocalChecked()));
    return;
  }

  std::string text((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());

  std::vector<std::string> words = split(text, " ");

  std::string temp = "";
  std::string result = "";
  int currentPage = 0;

  for (int i = 0; i < words.size(); i++) {
    std::string word = words[i];
    if (page == currentPage && i == words.size() - 1) {
      result = temp;
      break;
    }
    if (temp.length() + word.length() + 1 > maximalSymbols &&
        page == currentPage) {
      result = temp;
    }
    if (temp.length() + word.length() + 1 > maximalSymbols) {
      temp = "";
      currentPage++;
    }
    temp += word + " ";
  }

  result = std::to_string(currentPage) + " " + result;

  args.GetReturnValue().Set(
      String::NewFromUtf8(isolate, result.c_str()).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "read", Read);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
} // namespace demo
