// Add 'use client' directive to mark this component as client-side
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Ensure this works in the client-side
import { Card } from "@/components/ui/card";

export default function VerifyEmail() {
  const router = useRouter(); // Router should now work since the component is client-side

  const [formData, setFormData] = useState({ username: "", password: "" });

  return (
    <div className="min-h-screen max-w-sm container grid gap-4 mx-auto items-center">
      <section className="col-span-9 flex flex-col gap-4 ">
        <Card className="bg-background-200 p-2">
          <div className="flex flex-col p-8">
            <h1 className="font-bold text-2xl mb-2">Verify email</h1>
            <h2 className="mb-6">We sent a code to <span className="font-bold">user@email.com</span></h2>

            <form>
              <div className="flex flex-col gap-y-4 items-center"> 
                <div className="flex flex-row gap-x-2">
                  <input
                    type="text"
                    className="rounded-md w-12 bg-background-100 border border-foreground text-center"
                  />
                  <input
                    type="number"
                    className="rounded-md w-12 py-2 pl-2 bg-background-100 border border-foreground text-center"
                  />
                  <input
                    type="number"
                    className="rounded-md w-12 py-2 pl-2 bg-background-100 border border-foreground text-center"
                  />
                  <input
                    type="number"
                    className="rounded-md w-12 py-2 pl-2 bg-background-100 border border-foreground text-center"
                  />
                  <input
                    type="number"
                    className="rounded-md w-12 py-2 pl-2 bg-background-100 border border-foreground text-center"
                  />
                </div>
              </div>

              <div className="text-right pt-2 pb-2"> 
                <a href="#" className="hover: underline text-sm"> Forgot password? </a>
              </div>
              
              <button 
                type="button"
                className="w-full bg-primary rounded-md py-2"
              > 
              Sign In
              </button>
              
            </form>

            <div className="flex items-center my-6"> 
              <hr className="flex-grow muted-foreground border-t" />
              <span className="mx-2 text-sm">Or sign up with</span>
              <hr className="flex-grow border-t"/>
              
            </div>

            <div className="flex flex-row gap-x-4 justify-center">
              <button className="rounded-md">
                {/* Social media login icons like GitHub or Google would go here */}
              </button>
              <button className="rounded-md">
                {/* Social media login icons like GitHub or Google would go here */}
              </button>
            </div>

            <div className="text-center justify-center text-sm mt-6"> 
              <p> Already have an account? Click here to <a href="#" className="hover:underline">Sign in</a> </p>
            </div>
        </div>
        </Card>
      </section>
    </div>
  );
}
