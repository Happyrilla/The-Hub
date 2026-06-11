async function getgist() {
  const res = await fetch(
    'https://gist.githubusercontent.com/Happyrilla/61b062637d87e4b2592bee3a7501af24/raw/gistfile1.txt'
  );
  const text = await res.text();
  console.log(text);
}