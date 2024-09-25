"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    username:'',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const validateForm = () => {
    let formErrors: { [key:string]: string } = {};

    if (!formData.username) formErrors.username = "Please choose a username.";
    if (!formData.email) formErrors.email = "Please enter a valid email address.";
    if (!formData.password) formErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = "Passwords do not match.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch('/api/signup', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify (formData),
      });
      if (response.ok) {
        alert('Sign up successful!');
      } else {
        alert('Sign up failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (<div className="min-h-screen max-w-sm container grid gap-4 mx-auto items-center">
    <section className="col-span-9 flex flex-col gap-4 ">
        <Card className="bg-background-200 p-2">
          <div className="flex flex-col p-8">
            <h1 className="font-bold text-2xl mb-2"> Sign up</h1>
            <h2 className="mb-6">Join PeerPrep today and start your journey toward acing tech interviews!</h2>

            {/* To input log in details */}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-4"> 
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="rounded-md w-full py-2 pl-10 bg-input-foreground"
                    />
                    {errors.username && <p className="text-destructive">{errors.username}</p>}
                </div>


                <div>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-md w-full py-2 pl-10 bg-input-foreground"
                    />
                    {errors.email && <p className="text-destructive">{errors.email}</p>}
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded-md w-full py-2 pl-10 bg-input-foreground"
                    />
                    {errors.password && <p className="text-destructive">{errors.password}</p>}
                </div>

                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="rounded-md w-full py-2 pl-10 bg-input-foreground"
                    />
                    {errors.confirmPassword && <p className="text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              {/* Forgot password link */}
              <div className="text-right pt-2 pb-2"> 
                <a href="#" className="hover: underline text-sm"> Forgot password? </a>
              </div>
              
              {/* Sign in Button */}
              <button 
                type="submit"
                className="w-full bg-primary font-bold rounded-md py-2"
              > 
              Sign In
              </button>
              
            </form>

            {/* Or sign in with */}
            <div className="flex items-center my-6"> 
              <hr className="flex-grow muted-foreground border-t" />
              <span className="mx-2 text-sm">Or sign up with</span>
              <hr className="flex-grow border-t"/>
              
            </div>
            
            {/* Socials */}
            <div className="flex flex-row gap-x-4 justify-center">
              <button className="rounded-md">
                {/*<FaGithub size={24}/> */}
              </button>

              <button className="rounded-md">
               {/* <FaGoogle size={24}/>*/}
              </button>
            </div>

            {/* Sign up here */}
            <div className="text-center justify-center text-sm mt-6"> 
              <p> Already have an account? Click here to <a href="#" className="hover:underline">Sign in</a> </p>
            </div>

        </div>
        </Card>
    </section>
  </div>
  );
}