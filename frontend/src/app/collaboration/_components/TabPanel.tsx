import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsProps } from "@radix-ui/react-tabs";
import { LucideProps } from "lucide-react";
import { ComponentType, ReactNode, RefAttributes } from "react";
import { ButtonProps } from "react-day-picker";

export interface Tab {
  value: string;
  label: string;
  Icon?: ComponentType<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  content: ReactNode;
}

export interface TabPanelProps extends TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  tabChildren?: ReactNode;
}

export default function TabPanel({
  tabs,
  defaultValue,
  value,
  onValueChange,
  ...props
}: TabPanelProps) {
  return (
    <Tabs
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className="flex flex-col w-full h-full overflow-hidden bg-card rounded-xl"
      {...props}
    >
      <div className="flex-shrink-0 overflow-x-hidden rounded-t-lg bg-background-200">
        <TabOptions
          tabChildren={props.tabChildren}
          options={tabs.map((tab) => {
            return { value: tab.value, label: tab.label, Icon: tab.Icon };
          })}
        />
      </div>
      {tabs.map((tab) => (
        <TabsContent
          className="data-[state=active]:flex-1 m-0 h-full w-full"
          value={tab.value}
          key={tab.value}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

interface TabOptionsProps {
  options: TabButtonProps[];
  tabChildren?: ReactNode;
}

function TabOptions({ options, tabChildren }: TabOptionsProps) {
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
      {tabChildren}
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
