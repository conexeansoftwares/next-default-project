import { ReactNode } from 'react';

interface ILoginRoot {
  children: ReactNode;
}

export function LoginRoot({ children }: ILoginRoot) {
  return (
    <section className="bg-white">
      <div className="flex justify-center min-h-screen">
        <div className="bg-[#e5e5f7] bg-opacity-80 relative hidden lg:block lg:w-2/5">
          <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_0_0,transparent_0,#043e52_10px),repeating-linear-gradient(#e16a3d,#444cf7)]"></div>
        </div>

        <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
          <div className="w-full flex flex-col gap-y-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
