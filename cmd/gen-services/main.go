// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License"). You may
// not use this file except in compliance with the License. A copy of the
// License is located at
//
//     http://aws.amazon.com/apache2.0/
//
// or in the "license" file accompanying this file. This file is distributed
// on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing
// permissions and limitations under the License.

package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"github.com/aws-controllers-k8s/community/cmd/gen-services/internal/generator"
	"github.com/aws-controllers-k8s/community/cmd/gen-services/internal/scanner"
)

func main() {
	var (
		controllersDir = flag.String("controllers-dir", "", "path to ACK controller repositories")
		servicesOut    = flag.String("services-output", "", "output path for services.json")
		apiRefOut      = flag.String("api-ref-index", "", "output path for api-reference-index.json")
	)
	flag.Parse()

	if *controllersDir == "" || *servicesOut == "" || *apiRefOut == "" {
		fmt.Fprintln(os.Stderr, "error: all flags are required")
		flag.Usage()
		os.Exit(1)
	}

	controllersDir_, _ := filepath.Abs(*controllersDir)
	servicesOut_, _ := filepath.Abs(*servicesOut)
	apiRefOut_, _ := filepath.Abs(*apiRefOut)

	fmt.Printf("Scanning: %s\n", controllersDir_)

	controllers, err := scanner.Scan(controllersDir_)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Found %d controllers\n", len(controllers))

	if err := generator.Generate(controllers, servicesOut_, apiRefOut_); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Done")
}
