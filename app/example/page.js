export default async function Page() {
  const response = await fetch("http://localhost:3000/api/notes", {
    cache: "no-store",
  });
  const data = await response.json();

  //   console.log(data);

  return <div>{JSON.stringify(data)}</div>;
}
