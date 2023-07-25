import bookmarkRegular from "@iconify/icons-fluent/bookmark-24-regular";
import checkmarkCircleFilled from "@iconify/icons-fluent/checkmark-circle-24-filled";
import chevronLeftRegular from "@iconify/icons-fluent/chevron-left-24-regular";
import chevronRightRegular from "@iconify/icons-fluent/chevron-right-24-regular";
import circleRegular from "@iconify/icons-fluent/circle-24-regular";
import flagRegular from "@iconify/icons-fluent/flag-24-regular";
import { Icon } from "@iconify/react";
import Markdown from "~/components/markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const TABS = [
  {
    id: "problem",
    value: "Problem",
  },
  {
    id: "solutions",
    value: "Solutions",
  },
  {
    id: "submission",
    value: "Submission",
  },
  {
    id: "discussion",
    value: "Discussion",
  },
];

export default function ProblemViewer({ problem }: { problem: any }) {
  return (
    <Tabs defaultValue="problem">
      <div className="flex items-center justify-between">
        <TabsList className="w-full h-12 justify-start rounded-none border-b bg-transparent p-0">
          {TABS.map((tab) => (
            <TabsTrigger
              value={tab.id}
              className="relative h-12 rounded-none border-b-2 w-full border-b-transparent bg-transparent px-4 pb-3 pt-4 font-semibold text-slate-500 shadow-none transition-none data-[state=active]:border-b-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
              key={tab.id}
            >
              {tab.value}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <ScrollArea
        className="overflow-y-auto px-6 pt-0"
        style={{ height: "calc(100vh - 48px)" }}
      >
        <TabsContent value="problem">
          <div className="pt-4">
            <div className="flex items-start gap-2 justify-between">
              <div>
                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  {problem.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Question 8 of 2000
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="p-0 h-8 w-8">
                  <Icon
                    icon={chevronLeftRegular}
                    className="h-6 w-6 text-slate-600"
                  />
                </Button>
                <Button variant="outline" className="p-0 h-8 w-8">
                  <Icon
                    icon={chevronRightRegular}
                    className="h-6 w-6 text-slate-600"
                  />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2  mt-4">
              <div className="text-white bg-green-500 px-2 py-1 rounded-lg text-sm font-semibold">
                Easy
              </div>

              {false ? (
                <Button variant="ghost" className="p-0 h-8 w-8">
                  <Icon
                    icon={checkmarkCircleFilled}
                    className="h-6 w-6 text-green-500"
                  />
                </Button>
              ) : (
                <Button variant="ghost" className="p-0 h-8 w-8">
                  <Icon
                    icon={circleRegular}
                    className="h-6 w-6 text-slate-600"
                  />
                </Button>
              )}
              <Button variant="ghost" className="p-0 h-8 w-8">
                <Icon
                  icon={bookmarkRegular}
                  className="h-6 w-6 text-slate-600"
                />
              </Button>
              <Button variant="ghost" className="p-0 h-8 w-8">
                <Icon icon={flagRegular} className="h-6 w-6 text-slate-600" />
              </Button>
            </div>

            <div className="prose prose-slate max-w-none">
              <Markdown>{problem.statement}</Markdown>
            </div>
            <div className="prose prose-slate max-w-none prose-code:bg-slate-200 prose-code:px-2 prose-code:py-1 prose-code:text-xs prose-code:font-medium prose-code:rounded prose-code:before:no-underline prose-code:after:no-underline">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Example
              </h3>
              <div>
                <pre>
                  Input: s = &apos;abcabcbb&apos;
                  <br />
                  Output: 3 <br />
                  Explanation: The answer is &apos;abc&apos;, with the length of
                  3.
                </pre>
              </div>

              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Constraints
              </h3>
              <ul>
                <li>
                  <code>{"1 <= k <= events.length"}</code>
                </li>
                <li>
                  <code>{"1 <= k * events.length <= 106"}</code>
                </li>
                <li>
                  <code>s</code>
                  <span className="ml-1">
                    consists of English letters, digits, symbols and spaces.
                  </span>
                </li>
              </ul>
            </div>
            {/* <div className="flex flex-wrap gap-x-4 pt-6 pb-4 border-b text-sm">
              <div className="space-x-2">
                <span className="font-semibold">Accepted</span>
                <span>41.8K</span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">
                  Submissions
                </span>
                <span>68.8K</span>
              </div>
              <div className="space-x-2">
                <span className="font-semibold">
                  Acceptance Rate
                </span>
                <span>60.8%</span>
              </div>
            </div> */}
            <div className="pb-8">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Related topics</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Companies</AccordionTrigger>
                  <AccordionContent>
                    {["Facebook", "Amazon", "Apple", "Google", "LinkedIn"].map(
                      (value) => (
                        <Badge variant="outline" key={value}>
                          {value}
                        </Badge>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="submission">
          Change your submission here.
        </TabsContent>
        <TabsContent value="solutions">Change your editorial here.</TabsContent>
        <TabsContent value="discussion">
          Change your discussion here.
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
