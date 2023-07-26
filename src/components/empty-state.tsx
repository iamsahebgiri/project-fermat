import Image from "next/image";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {
  children?: React.ReactNode;
  title: string;
  subtitle?: string;
  url?: string | any;
};

export default function EmptyState({ children, title, subtitle, url }: Props) {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="h-32 w-32 relative">
        {url && <Image src={url} height={240} width={240} alt={title} />}
      </div>
      <h2 className="text-xl font-bold text-slate-950 mt-2 text-center">
        <Balancer>{title}</Balancer>
      </h2>
      <p className="text-slate-600 text-sm text-center max-w-md"><Balancer>{subtitle}</Balancer></p>
        
    </div>
  );
}
