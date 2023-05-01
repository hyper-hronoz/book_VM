#include <fstream>
#include <iostream>
#include <regex>
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
  int page = 3;

  std::string text((std::istreambuf_iterator<char>(file)),
                   std::istreambuf_iterator<char>());

  std::vector<std::string> words = split(text, " ");


  std::string temp = "";
  std::string result = "";
  int currentPage = 0;

  for (std::string word : words) {
    if (temp.length() + word.length() + 1 > maximalSymbols && page == currentPage) {
      result = temp;
      break;
    }
    if (temp.length() + word.length() + 1 > maximalSymbols) {
      temp = "";
      currentPage++;
    }
    temp += word + " ";
  }

  cout << result << endl;
  // cout << "Please input page: ";
  // cin >> page;

  // std::string result = "";

  return 0;
}
