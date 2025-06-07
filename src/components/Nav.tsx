import { Button } from "@/ui/button";
import { TextField, TextFieldRoot } from "@/ui/textfield";
import { useLocation } from "@solidjs/router";
import { A } from '@solidjs/router';

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-white shadow">
      <div class="container mx-auto flex justify-between items-center py-4 px-4">
        <A href="/" class={`text-xl font-bold text-blue-600 ${active("/")}`} > Crunchbase Clone</A>
        <div class="hidden md:flex space-x-6">
          <A href="/companies" class="text-gray-700 hover:text-blue-600">Companies</A>
          <A href="/industries" class="text-gray-700 hover:text-blue-600">Industries</A>
          <A href="/about" class="text-gray-700 hover:text-blue-600">About</A>
        </div>
        <form class="flex w-full md:w-auto">
          <TextFieldRoot>
            <TextField
              type="text"
              placeholder="Search companies..."
              class="w-full md:w-64"
            />
            <Button type="submit" class="ml-2">Search</Button>
          </TextFieldRoot>
        </form>
      </div >
    </nav >
  );
}



