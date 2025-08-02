"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Layers, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import MockTestCard from "./mock-test-card";

const NestedMockTestAccordion = ({
  organizedMockTests,
  bookIndexList,
  productId,
  productLevel,
  className,
}) => {
  if (!organizedMockTests || Object.keys(organizedMockTests).length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <FileText className="mr-2 h-4 w-4" />
        No mock tests available
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Object.entries(organizedMockTests).map(([standardId, standardData]) => {
        const standard = bookIndexList[standardId];

        return (
          <Card key={standardId} className="overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {/* Subject Level */}
                {Object.entries(standardData.subjects).map(
                  ([subjectId, subjectData]) => {
                    const subject = bookIndexList[subjectId];

                    return (
                      <AccordionItem
                        key={subjectId}
                        value={subjectId}
                        className="border-b"
                      >
                        <AccordionTrigger className="px-6 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                            <span>{subject?.subject || "Subject"}</span>
                            <Badge variant="outline" className="ml-2">
                              {subjectData.mockTests.length +
                                Object.values(subjectData.chapters).reduce(
                                  (acc, chapter) =>
                                    acc + chapter.mockTests.length,
                                  0
                                )}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <div className="space-y-4">
                              {/* Chapter Level */}
                              {Object.entries(subjectData.chapters).map(
                                ([chapterId, chapterData]) => {
                                  const chapter = bookIndexList[chapterId];

                                  return (
                                    <AccordionItem
                                      key={chapterId}
                                      value={chapterId}
                                      className="border rounded-lg"
                                    >
                                      <AccordionTrigger className="px-1 hover:no-underline">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-orange-600" />
                                          <span>
                                            {chapter?.chapter || "Chapter"}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="ml-2"
                                          >
                                            {chapterData.mockTests.length +
                                              Object.values(
                                                chapterData.concepts
                                              ).reduce(
                                                (acc, concept) =>
                                                  acc +
                                                  concept.mockTests.length,
                                                0
                                              )}
                                          </Badge>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="px-1">
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="w-full"
                                        >
                                          <div className="space-y-4">
                                            {/* Concept Level */}
                                            {Object.entries(
                                              chapterData.concepts
                                            ).map(
                                              ([conceptId, conceptData]) => {
                                                const concept =
                                                  bookIndexList[conceptId];

                                                return (
                                                  <AccordionItem
                                                    key={conceptId}
                                                    value={conceptId}
                                                    className="border rounded-lg bg-gray-50/50 dark:bg-gray-900/50"
                                                  >
                                                    <AccordionTrigger className="px-1 hover:no-underline">
                                                      <div className="flex items-center gap-2">
                                                        <Target className="h-4 w-4 text-red-600" />
                                                        <span>
                                                          {concept?.concept ||
                                                            "Concept"}
                                                        </span>
                                                        <Badge
                                                          variant="outline"
                                                          className="ml-2"
                                                        >
                                                          {
                                                            conceptData
                                                              .mockTests.length
                                                          }
                                                        </Badge>
                                                      </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-1">
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {conceptData.mockTests.map(
                                                          (testId) => (
                                                            <MockTestCard
                                                              key={testId}
                                                              mockTestId={
                                                                testId
                                                              }
                                                              productId={
                                                                productId
                                                              }
                                                            />
                                                          )
                                                        )}
                                                      </div>
                                                    </AccordionContent>
                                                  </AccordionItem>
                                                );
                                              }
                                            )}

                                            {/* Chapter Level Mock Tests */}
                                            {chapterData.mockTests.length >
                                              0 && (
                                              <AccordionItem
                                                value="chapter-tests"
                                                className="border rounded-lg bg-gray-50/50 dark:bg-gray-900/50"
                                              >
                                                <AccordionTrigger className="px-1 hover:no-underline">
                                                  <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-red-600" />
                                                    <span>Miscellaneous</span>
                                                    <Badge
                                                      variant="outline"
                                                      className="ml-2"
                                                    >
                                                      {
                                                        chapterData.mockTests
                                                          .length
                                                      }
                                                    </Badge>
                                                  </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-1">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {chapterData.mockTests.map(
                                                      (testId) => (
                                                        <MockTestCard
                                                          key={testId}
                                                          mockTestId={testId}
                                                          productId={productId}
                                                        />
                                                      )
                                                    )}
                                                  </div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            )}
                                          </div>
                                        </Accordion>
                                      </AccordionContent>
                                    </AccordionItem>
                                  );
                                }
                              )}

                              {/* Subject Level Mock Tests */}
                              {subjectData.mockTests.length > 0 && (
                                <AccordionItem
                                  value="subject-tests"
                                  className="border rounded-lg"
                                >
                                  <AccordionTrigger className="px-1 hover:no-underline">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-orange-600" />
                                      <span>Miscellaneous</span>
                                      <Badge variant="outline" className="ml-2">
                                        {subjectData.mockTests.length}
                                      </Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="px-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {subjectData.mockTests.map((testId) => (
                                        <MockTestCard
                                          key={testId}
                                          mockTestId={testId}
                                          productId={productId}
                                        />
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}
                            </div>
                          </Accordion>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }
                )}

                {/* Standard Level Mock Tests */}
                {standardData.mockTests.length > 0 && (
                  <AccordionItem value="standard-tests" className="border-b">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                        <Target className="h-4 w-4 text-green-600" />
                        <span>Miscellaneous</span>
                        <Badge variant="outline" className="ml-2">
                          {standardData.mockTests.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {standardData.mockTests.map((testId) => (
                          <MockTestCard
                            key={testId}
                            mockTestId={testId}
                            productId={productId}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default NestedMockTestAccordion;
