import { Card } from "@/components/ui/card";
import TextInput from "./components/textInput";
import SignInButton from "./components/signin";
import SocialButton from "./components/socialLogin";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { FiUser, FiLock } from "react-icons/fi";

export default function DashboardPage() {
  return <div className="min-h-screen max-w-sm container grid gap-4 mx-auto items-center">
    <section className="col-span-9 flex flex-col gap-4 ">
        <Card className="bg-background-200 p-3">
          <div className="flex flex-col p-8">
            <h1 className="font-bold text-2xl mb-2"> Welcome!</h1>
            <h2 className="mb-6">Log in to start coding!</h2>

            {/* To input log in details */}
            <form>
              <div className="flex flex-col gap-y-4"> 
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username / Email"
                    className="rounded-md w-full py-2 pl-10 bg-muted-foreground"
                    />
                </div>


                <div>
                  <input
                    type="text"
                    name="passwrod"
                    placeholder="Password"
                    className="rounded-md w-full py-2 pl-10 bg-muted-foreground"
                    />
                </div>
              </div>
              
              {/* Forgot password link */}
              <div className="text-right pt-2 pb-2"> 
                <a href="#" className="hover:underline text-sm"> Forgot password? </a>
              </div>
              
              <button 
                type="button"
                className="w-full bg-primary rounded-md py-2"
              > 
              Sign In
              </button>
              
            </form>

            {/* Or sign in with */}
            <div className="flex items-center my-6"> 
              <hr className="flex-grow muted-foreground border-t" />
              <span className="mx-2 text-sm">Or sign in with</span>
              <hr className="flex-grow border-t"/>
              
            </div>
            
            {/* Socials */}
            <div className="flex flex-row gap-x-4 justify-center">
              <button className="rounded-md">
                <FaGithub size={24}/>
              </button>

              <button className="rounded-md">
                <FaGoogle size={24}/>
              </button>
            </div>

            {/* Sign up here */}
            <div className="text-center justify-center text-sm mt-6"> 
              <p> No account yet? <a href="#" className="hover:underline">Sign up</a> </p>
            </div>

        </div>
        </Card>
    </section>
  </div>;
}

