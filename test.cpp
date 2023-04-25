#include <fstream>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

vector<string> split(string str, string token) {
  vector<string> result;
  while (str.size()) {
    int index = str.find(token);
    if (index != string::npos) {
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

int main() {
  std::ifstream file(
      "./books/Guide-to-the-Tientsi-Tientsin-Anglo--[ebooksread.com].txt");

  int maximalSymbols = 300;

  std::string text((std::istreambuf_iterator<char>(file)),
                   std::istreambuf_iterator<char>());

  std::vector<std::string> words = split(text, " ");

  std::string response{};

  for (std::string word : words) {
    if (response.length() + word.length() <= maximalSymbols) {
      response += word;
    }
  }

  cout << response << endl;


  return 0;
}
