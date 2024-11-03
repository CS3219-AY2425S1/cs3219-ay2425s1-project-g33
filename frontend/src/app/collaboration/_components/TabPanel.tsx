import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideProps } from "lucide-react";
import { ComponentType, HTMLAttributes, ReactNode, RefAttributes } from "react";
import { ButtonProps } from "react-day-picker";

export interface Tab {
  value: string;
  label: string;
  Icon?: ComponentType<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  content: ReactNode;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  defaultValue: string;
}

export default function TabPanel({
  tabs,
  defaultValue,
  ...props
}: TabPanelProps) {
  return (
    <Card className="h-full p-0" {...props}>
      <Tabs defaultValue={defaultValue} className="flex flex-col h-full">
        <CardHeader className="flex-shrink-0 p-0 overflow-x-hidden rounded-t-lg bg-background-200">
          <TabOptions
            options={tabs.map((tab) => {
              return { value: tab.value, label: tab.label, Icon: tab.Icon };
            })}
          />
        </CardHeader>
        {tabs.map((tab) => (
          <TabsContent className="data-[state=active]:flex-1 m-0" value={tab.value} key={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

interface TabOptionsProps {
  options: TabButtonProps[];
}

function TabOptions({ options }: TabOptionsProps) {
  return (
    <TabsList className="flex items-center justify-start bg-transparent">
      {options.map((option) => (
        <TabButton
          key={option.value}
          value={option.value}
          label={option.label}
          Icon={option.Icon}
        />
      ))}
    </TabsList>
  );
}

interface TabButtonProps extends ButtonProps {
  value: string;
  label: string;
  Icon?: ComponentType<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

function TabButton({ value, label, Icon, ...props }: TabButtonProps) {
  return (
    <TabsTrigger key={value} value={value} asChild={true}>
      <Button
        variant="ghost"
        className="h-auto hover:bg-transparent hover:text-primary text-card-foreground-100 data-[state=active]:text-foreground"
        {...props}
      >
        {Icon && <Icon size={15} className="mr-1" />}
        {label}
      </Button>
    </TabsTrigger>
  );
}
