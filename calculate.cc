#include <node.h>
#include <iostream>
  
namespace calculate {
     using v8:: FunctionCallbackInfo;
     using v8 :: Isolate;
     using v8 :: Local;
     using v8 :: Object;
     using v8 :: Number;
     using v8 :: Value;
  
     void Sum(const FunctionCallbackInfo<Value>&args) {
        Isolate* isolate = args.GetIsolate();
        double
        x = 3.141526,
           y = 2.718;
        for (int i = 0; i < 1000000000; i++) {
            x += y;
        }
        auto total = Number::New(isolate,x);
        args.GetReturnValue().Set(total);
     }

     // Exports our method
     void Initialize(Local<Object> exports) {
         NODE_SET_METHOD(exports, "calc", Sum);
     }
     NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
 }
