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
  int page = 0;

  std::string text((std::istreambuf_iterator<char>(file)),
                   std::istreambuf_iterator<char>());

  std::vector<std::string> words = split(text, " ");


  std::string temp = "";
  std::string result = "";
  int currentPage = 0;
  int pageCount = 0;

  for (int i = 0; i < words.size(); i++) {
    std::string word = words[i];
    if (page == currentPage && i == words.size() - 1) {
      result = temp;
      break;
    }
    if (temp.length() + word.length() + 1 > maximalSymbols && page == currentPage) {
      result = temp;
    }
    if (temp.length() + word.length() + 1 > maximalSymbols) {
      temp = "";
      currentPage++;
    }
    temp += word + " ";
  }

  cout << result << endl;
  cout << currentPage << endl;
  // cout << "Please input page: ";
  // cin >> page;

  // std::string result = "";

  return 0;
}